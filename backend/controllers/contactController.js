const Contact = require('../models/Contact');

// Submit contact form
const submitContact = async (req, res) => {
  try {
    const { firstName, middleName, lastName, email, subject, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Create new contact submission
    const contact = await Contact.create({
      firstName,
      middleName: middleName || '',
      lastName,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      contact
    });
  } catch (error) {
    console.error('submitContact:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit contact form'
    });
  }
};

// Get all contact submissions (admin only)
const getContacts = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      contacts
    });
  } catch (error) {
    console.error('getContacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch contact submissions'
    });
  }
};

// Update contact status (admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'contacted', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      contact
    });
  } catch (error) {
    console.error('updateContactStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to update contact status'
    });
  }
};

module.exports = {
  submitContact,
  getContacts,
  updateContactStatus
};
