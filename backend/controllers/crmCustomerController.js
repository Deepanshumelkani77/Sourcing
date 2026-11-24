const User = require("../models/User");
const Lead = require("../models/Lead");

// Customers are stored in the User collection.
// This controller exposes a customer-friendly shape on top of User documents.

const fullName = (u) =>
  [u.firstName, u.middleName, u.lastName].filter(Boolean).join(" ").trim() ||
  u.customerName ||
  u.email ||
  "Customer";

const toCustomer = (u) => {
  if (!u) return u;
  const obj = u.toObject ? u.toObject() : { ...u };
  return {
    ...obj,
    customerName: fullName(obj),
    status: obj.customerStatus || "Active",
    totalRevenue: obj.totalSpent || 0,
    _isUser: true,
  };
};

const splitName = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] };
};

const pickCustomerFields = (body) => {
  const data = {};
  const fields = [
    "companyName", "phone", "whatsapp", "alternateMobile", "email",
    "address", "city", "state", "country", "pincode",
    "gstNumber", "panNumber", "source", "customerStatus", "notes",
    "assignedTo", "leadId", "approvalStatus"
  ];
  fields.forEach((f) => {
    if (body[f] !== undefined) data[f] = body[f];
  });
  // CRM pages send `status`; map it to customerStatus
  if (body.status !== undefined && body.customerStatus === undefined) {
    data.customerStatus = body.status;
  }
  // CRM pages may send a single customerName
  if (body.customerName && !body.firstName) {
    const { firstName, lastName } = splitName(body.customerName);
    data.firstName = firstName;
    data.lastName = lastName;
  }
  return data;
};

// @desc    Create a new customer (creates a User account profile)
// @route   POST /api/crm/customers
// @access  Private/Admin
exports.createCustomer = async (req, res) => {
  try {
    const data = pickCustomerFields(req.body);

    const existing = await User.findOne({ email: (data.email || "").toLowerCase() });
    if (existing) {
      Object.assign(existing, data, { customerStatus: data.customerStatus || existing.customerStatus });
      if (!existing.companyName && data.companyName) existing.companyName = data.companyName;
      await existing.save();
      return res.status(200).json({ success: true, data: toCustomer(existing), message: "Existing user updated as customer" });
    }

    const customer = await User.create({
      emailVerified: true,
      approvalStatus: "approved",
      customerStatus: "Active",
      ...data
    });

    res.status(201).json({ success: true, data: toCustomer(customer) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/crm/customers
// @access  Private/Admin
exports.getCustomers = async (req, res) => {
  try {
    const { status, source, assignedTo, search } = req.query;

    const query = {};
    if (status) query.customerStatus = status;
    if (source) query.source = source;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const customers = await User.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("assignedTo", "firstName lastName email")
      .populate("leadId", "customerName productRequirement")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers.map(toCustomer),
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get single customer
// @route   GET /api/crm/customers/:id
// @access  Private/Admin
exports.getCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("assignedTo", "firstName lastName email")
      .populate("leadId", "customerName productRequirement");

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    res.status(200).json({ success: true, data: toCustomer(customer) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update customer
// @route   PUT /api/crm/customers/:id
// @access  Private/Admin
exports.updateCustomer = async (req, res) => {
  try {
    let customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const data = pickCustomerFields(req.body);
    Object.assign(customer, data);
    await customer.save();

    res.status(200).json({ success: true, data: toCustomer(customer) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete customer
// @route   DELETE /api/crm/customers/:id
// @access  Private/Admin
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    await customer.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get customer statistics
// @route   GET /api/crm/customers/stats
// @access  Private/Admin
exports.getCustomerStats = async (req, res) => {
  try {
    const [totalCustomers, activeCustomers, inactiveCustomers, blacklisted, totalRevenue, recentCustomers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ customerStatus: "Active" }),
      User.countDocuments({ customerStatus: "Inactive" }),
      User.countDocuments({ customerStatus: "Blacklisted" }),
      User.aggregate([{ $group: { _id: null, total: { $sum: "$totalSpent" } } }]),
      User.find().sort({ createdAt: -1 }).limit(5).select("firstName lastName companyName createdAt")
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        blacklisted,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentCustomers: recentCustomers.map(toCustomer),
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Shared helper: create or update a User from a won lead
const USER_SOURCES = ["Website", "WhatsApp", "Exhibition", "Referral", "Email", "Phone", "Other", "CRM Lead"];

const upsertUserFromLead = async (lead, adminId) => {
  const nameSource = lead.customerName || [lead.firstName, lead.lastName].filter(Boolean).join(" ");
  const { firstName, lastName } = splitName(nameSource);
  const leadSource = USER_SOURCES.includes(lead.source) ? lead.source : "CRM Lead";

  const leadFields = {
    firstName: firstName || lead.firstName || "",
    lastName: lead.lastName || lastName || "",
    phone: lead.mobileNumber || lead.phone || "",
    whatsapp: lead.whatsapp || lead.mobileNumber || lead.phone || "",
    alternateMobile: lead.alternatePhone || "",
    email: (lead.email || "").toLowerCase(),
    companyName: lead.companyName || "",
    address: lead.address || "",
    city: lead.city || "",
    state: lead.state || "",
    country: lead.country || "India",
    pincode: lead.pincode || "",
    source: leadSource,
    assignedTo: lead.assignedTo || undefined,
    leadId: lead._id,
    approvalStatus: "approved",
    customerStatus: "Active",
    authProvider: lead.authProvider || "lead"
  };

  let user = null;
  if (leadFields.email) {
    user = await User.findOne({ email: leadFields.email });
  }
  if (!user && leadFields.phone) {
    user = await User.findOne({ phone: leadFields.phone });
  }

  if (user) {
    // Fill only empty fields so existing signup data is preserved
    Object.keys(leadFields).forEach((key) => {
      const val = leadFields[key];
      if (val !== undefined && val !== null && val !== "" && (user[key] === undefined || user[key] === null || user[key] === "")) {
        user[key] = val;
      }
    });
    if (!user.leadId) user.leadId = lead._id;
    if (!user.companyName && leadFields.companyName) user.companyName = leadFields.companyName;
    await user.save();
  } else {
    user = await User.create({ ...leadFields, approvedAt: new Date() });
  }

  return user;
};

exports.upsertUserFromLead = upsertUserFromLead;
