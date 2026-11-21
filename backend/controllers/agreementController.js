const Agreement = require('../models/Agreement');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const PDFDocument = require('pdfkit');
const { sendAgreementEmail } = require('../services/emailService');

const AGREEMENT_STATUSES = ['draft', 'pending_review', 'sent', 'viewed', 'signed', 'rejected', 'expired', 'cancelled'];
const EDITABLE_STATUSES = ['draft', 'pending_review', 'sent'];

const generateAgreementNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `AGR-${year}-`;
  const last = await Agreement.findOne({ agreementNumber: { $regex: `^${prefix}` } })
    .sort({ agreementNumber: -1 })
    .select('agreementNumber');
  const next = last ? parseInt(last.agreementNumber.split('-').pop(), 10) + 1 : 1;
  return `${prefix}${String(next).padStart(4, '0')}`;
};

const composeCustomerName = (body) => {
  const composed = [body.firstName, body.middleName, body.lastName].filter(Boolean).join(' ').trim();
  return composed || body.customerName || '';
};

const NUMERIC_FIELDS = ['sourcingServiceCharges', 'advancePayment', 'remainingPayment'];

const sanitizeBody = (body) => {
  const data = { ...body };
  // Remove empty strings for ObjectId/Date fields to avoid CastError
  ['order', 'validUntil', 'agreementDate', 'customer'].forEach((key) => {
    if (data[key] === '') delete data[key];
  });
  NUMERIC_FIELDS.forEach((key) => {
    if (data[key] === '') data[key] = 0;
    else if (data[key] !== undefined && data[key] !== null) data[key] = Number(data[key]) || 0;
  });
  return data;
};

const computeTotals = (products = [], sourcingServiceCharges = 0) => {
  const productTotal = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.unitPrice || 0)), 0);
  return {
    products: products.map((p) => ({
      productName: p.productName || '',
      description: p.description || '',
      quantity: p.quantity || 0,
      unitPrice: p.unitPrice || 0,
      totalPrice: (p.quantity || 0) * (p.unitPrice || 0)
    })),
    totalAmount: productTotal + (sourcingServiceCharges || 0)
  };
};

const buildPdfBuffer = (agreement) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const accent = '#F41703';
    const line = () => doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e5e7eb').stroke();

    // Header
    doc.fontSize(20).fillColor('#111827').text('IndoChinaBridge', { align: 'center' });
    doc.fontSize(11).fillColor(accent).text('SOURCING SERVICES AGREEMENT', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor('#6b7280').text(
      `Agreement No: ${agreement.agreementNumber}    |    Date: ${agreement.agreementDate ? new Date(agreement.agreementDate).toLocaleDateString() : 'N/A'}    |    Status: ${(agreement.status || '').toUpperCase()}`,
      { align: 'center' }
    );
    doc.moveDown(1);
    line();
    doc.moveDown(1);

    const section = (title) => {
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor(accent).text(title.toUpperCase());
      doc.moveDown(0.3);
      line();
      doc.moveDown(0.4);
    };

    const kv = (label, value) => {
      if (!value && value !== 0) return;
      doc.fontSize(9).fillColor('#6b7280').text(label, { continued: false });
      doc.fontSize(10).fillColor('#111827').text(String(value));
      doc.moveDown(0.3);
    };

    // 1. Parties
    section('1. Parties');
    kv('Customer', agreement.customerName);
    kv('Company', agreement.customerCompany);
    kv('Address', agreement.customerAddress);
    kv('Email', agreement.customerEmail);
    kv('Related Order', agreement.orderNumber || 'N/A');

    // 2. Products
    section('2. Products & Order Details');
    (agreement.products || []).forEach((p, i) => {
      doc.fontSize(10).fillColor('#111827')
        .text(`${i + 1}. ${p.productName || 'Product'} — Qty: ${p.quantity} x ${agreement.currency || 'USD'} ${p.unitPrice} = ${agreement.currency || 'USD'} ${p.totalPrice}`);
      if (p.description) doc.fontSize(8).fillColor('#6b7280').text(`   ${p.description}`);
      doc.moveDown(0.3);
    });
    doc.fontSize(10).fillColor('#111827')
      .text(`Product Value: ${agreement.currency || 'USD'} ${(agreement.products || []).reduce((s, p) => s + (p.totalPrice || 0), 0).toFixed(2)}`);
    kv('Sourcing Service Charges', agreement.sourcingServiceCharges ? `${agreement.currency || 'USD'} ${agreement.sourcingServiceCharges}` : '');
    kv('Total Agreement Amount', `${agreement.currency || 'USD'} ${agreement.totalAmount || 0}`);
    if (agreement.validUntil) kv('Valid Until', new Date(agreement.validUntil).toLocaleDateString());

    // 3. Service Terms
    section('3. Sourcing & Service Terms');
    kv('Supplier Details', agreement.supplierDetails);
    kv('Quality Inspection Terms', agreement.qualityInspectionTerms);
    kv('Sample Approval Terms', agreement.sampleApprovalTerms);
    kv('Packaging Requirements', agreement.packagingRequirements);
    kv('Delivery Timeline', agreement.deliveryTimeline);
    kv('Shipping Terms', agreement.shippingTerms);
    kv('Customs & Import Duty', agreement.customsDutyResponsibility);

    // 4. Payment Terms
    section('4. Payment Terms');
    kv('Advance Payment', agreement.advancePayment ? `${agreement.currency || 'USD'} ${agreement.advancePayment}` : '');
    kv('Remaining Payment', agreement.remainingPayment ? `${agreement.currency || 'USD'} ${agreement.remainingPayment}` : '');
    kv('Payment Milestones', agreement.paymentMilestones);
    kv('Payment Method', agreement.paymentMethod);
    kv('Refund & Cancellation Policy', agreement.refundPolicy);

    // 5. Conditions
    section('5. Agreement Conditions');
    kv('Responsibilities of IndoChinaBridge', agreement.icbResponsibilities);
    kv('Responsibilities of Customer', agreement.customerResponsibilities);
    kv('Delivery & Delay Conditions', agreement.deliveryDelayConditions);
    kv('Quality & Dispute Resolution', agreement.disputeResolution);
    kv('Confidentiality', agreement.confidentiality);
    kv('Termination Conditions', agreement.terminationConditions);

    // Signatures
    doc.moveDown(2);
    line();
    doc.moveDown(1);
    const sigY = doc.y;
    doc.fontSize(9).fillColor('#6b7280').text('For IndoChinaBridge', 70, sigY, { width: 200 });
    doc.text('For Customer', 345, sigY, { width: 200 });
    doc.moveDown(3);
    doc.moveTo(70, doc.y).lineTo(270, doc.y).strokeColor('#9ca3af').stroke();
    doc.moveTo(345, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor('#6b7280').text('Authorised Signatory', 70, doc.y, { width: 200 });
    doc.text(agreement.customerName || 'Customer', 345, doc.y - 12, { width: 200 });

    if (agreement.signedDocument && agreement.signedDocument.url) {
      doc.moveDown(2);
      doc.fontSize(9).fillColor('#059669').text(`Signed document on file: ${agreement.signedDocument.name || 'uploaded'}`);
      if (agreement.signerName) doc.text(`Signed by: ${agreement.signerName}`);
      if (agreement.signedAt) doc.text(`Signed at: ${new Date(agreement.signedAt).toLocaleString()}`);
    }

    doc.end();
  });
};

// @route   GET /api/agreements
exports.getAllAgreements = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { agreementNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerCompany: { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }
    const agreements = await Agreement.find(filter)
      .populate('customer', 'customerName companyName email')
      .populate('order', 'orderNumber status')
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json({ success: true, agreements });
  } catch (error) {
    console.error('Error fetching agreements:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch agreements' });
  }
};

// @route   GET /api/agreements/stats
exports.getAgreementStats = async (req, res) => {
  try {
    const [total, draft, pendingReview, sent, signed, rejected] = await Promise.all([
      Agreement.countDocuments(),
      Agreement.countDocuments({ status: 'draft' }),
      Agreement.countDocuments({ status: 'pending_review' }),
      Agreement.countDocuments({ status: 'sent' }),
      Agreement.countDocuments({ status: 'signed' }),
      Agreement.countDocuments({ status: 'rejected' })
    ]);
    res.json({ success: true, stats: { total, draft, pendingReview, sent, signed, rejected } });
  } catch (error) {
    console.error('Error fetching agreement stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

// @route   GET /api/agreements/:id
exports.getAgreementById = async (req, res) => {
  try {
    const agreement = await Agreement.findById(req.params.id)
      .populate('customer', 'customerName companyName email phone address city state country')
      .populate('order', 'orderNumber status items totalAmount')
      .populate('createdBy', 'firstName lastName email');
    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }
    res.json({ success: true, agreement });
  } catch (error) {
    console.error('Error fetching agreement:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch agreement' });
  }
};

// @route   POST /api/agreements
exports.createAgreement = async (req, res) => {
  try {
    const body = sanitizeBody(req.body);
    const customer = await Customer.findById(body.customer);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    let order = null;
    if (body.order) {
      order = await Order.findById(body.order);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
    }

    const { products, totalAmount } = computeTotals(req.body.products, req.body.sourcingServiceCharges);
    const agreementNumber = await generateAgreementNumber();

    const agreement = await Agreement.create({
      ...body,
      agreementNumber,
      products,
      totalAmount,
      customerName: composeCustomerName(body) || customer.customerName,
      customerCompany: req.body.customerCompany || customer.companyName,
      customerAddress: req.body.customerAddress || [customer.address, customer.city, customer.state, customer.country].filter(Boolean).join(', '),
      customerEmail: req.body.customerEmail || customer.email,
      orderNumber: order ? order.orderNumber : (body.orderNumber || ''),
      status: 'draft',
      createdBy: req.user?._id || req.user?.id,
      history: [{ status: 'draft', note: 'Agreement created', changedBy: req.user?._id || req.user?.id }]
    });

    res.status(201).json({ success: true, agreement, message: 'Agreement created successfully' });
  } catch (error) {
    console.error('Error creating agreement:', error);
    res.status(500).json({ success: false, message: 'Failed to create agreement', error: error.message });
  }
};

// @route   PUT /api/agreements/:id
exports.updateAgreement = async (req, res) => {
  try {
    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }
    if (!EDITABLE_STATUSES.includes(agreement.status)) {
      return res.status(400).json({ success: false, message: `Cannot edit agreement in "${agreement.status}" status` });
    }

    const { products, totalAmount } = computeTotals(req.body.products, req.body.sourcingServiceCharges);
    const body = sanitizeBody(req.body);
    Object.assign(agreement, {
      ...body,
      products,
      totalAmount,
      customerName: composeCustomerName(body) || agreement.customerName,
      agreementNumber: agreement.agreementNumber // never allow renumbering
    });
    await agreement.save();

    res.json({ success: true, agreement, message: 'Agreement updated successfully' });
  } catch (error) {
    console.error('Error updating agreement:', error);
    res.status(500).json({ success: false, message: 'Failed to update agreement' });
  }
};

// @route   PATCH /api/agreements/:id/status
exports.updateAgreementStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!AGREEMENT_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }

    agreement.status = status;
    if (status === 'sent' && !agreement.sentAt) agreement.sentAt = new Date();
    agreement.history.push({
      status,
      note: note || '',
      changedBy: req.user?._id || req.user?.id
    });
    await agreement.save();

    res.json({ success: true, agreement, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating agreement status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

// @route   GET /api/agreements/:id/pdf
exports.downloadAgreementPdf = async (req, res) => {
  try {
    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }
    const pdfBuffer = await buildPdfBuffer(agreement);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${agreement.agreementNumber}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating agreement PDF:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF' });
  }
};

// @route   POST /api/agreements/:id/send
exports.sendAgreement = async (req, res) => {
  try {
    const agreement = await Agreement.findById(req.params.id).populate('customer', 'email customerName');
    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }
    if (['signed', 'cancelled'].includes(agreement.status)) {
      return res.status(400).json({ success: false, message: `Cannot send agreement in "${agreement.status}" status` });
    }

    const email = agreement.customerEmail || agreement.customer?.email;
    if (email) {
      await sendAgreementEmail(email, {
        agreementNumber: agreement.agreementNumber,
        customerName: agreement.customerName || agreement.customer?.customerName,
        totalAmount: agreement.totalAmount,
        currency: agreement.currency,
        agreementDate: agreement.agreementDate
      });
    }

    agreement.status = 'sent';
    agreement.sentAt = new Date();
    agreement.history.push({
      status: 'sent',
      note: email ? `Sent to ${email}` : 'Marked as sent (no customer email)',
      changedBy: req.user?._id || req.user?.id
    });
    await agreement.save();

    res.json({ success: true, agreement, message: email ? `Agreement sent to ${email}` : 'Agreement marked as sent' });
  } catch (error) {
    console.error('Error sending agreement:', error);
    res.status(500).json({ success: false, message: 'Failed to send agreement', error: error.message });
  }
};

// @route   POST /api/agreements/:id/sign
exports.signAgreement = async (req, res) => {
  try {
    const { signerName, signedDocument } = req.body;
    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }
    if (['signed', 'cancelled'].includes(agreement.status)) {
      return res.status(400).json({ success: false, message: `Cannot sign agreement in "${agreement.status}" status` });
    }
    if (!signerName) {
      return res.status(400).json({ success: false, message: 'Signer name is required' });
    }

    agreement.status = 'signed';
    agreement.signerName = signerName;
    agreement.signedAt = new Date();
    if (signedDocument && signedDocument.url) {
      agreement.signedDocument = signedDocument;
    }
    agreement.history.push({
      status: 'signed',
      note: `Signed by ${signerName}`,
      changedBy: req.user?._id || req.user?.id
    });
    await agreement.save();

    res.json({ success: true, agreement, message: 'Agreement marked as signed' });
  } catch (error) {
    console.error('Error signing agreement:', error);
    res.status(500).json({ success: false, message: 'Failed to sign agreement' });
  }
};

// @route   DELETE /api/agreements/:id
exports.deleteAgreement = async (req, res) => {
  try {
    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }
    if (!['draft', 'cancelled'].includes(agreement.status)) {
      return res.status(400).json({ success: false, message: 'Only draft or cancelled agreements can be deleted' });
    }
    await Agreement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Agreement deleted successfully' });
  } catch (error) {
    console.error('Error deleting agreement:', error);
    res.status(500).json({ success: false, message: 'Failed to delete agreement' });
  }
};
