const Announcement = require("../models/Announcement");

// @desc    Get announcements (active only unless ?all=true)
// @route   GET /api/announcements
// @access  Private/Admin
exports.getAnnouncements = async (req, res) => {
  try {
    const query = req.query.all === "true" ? {} : { isActive: true };
    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
exports.createAnnouncement = async (req, res) => {
  try {
    const { text, tag, link, isActive } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Announcement text is required" });
    }

    const announcement = await Announcement.create({
      text: text.trim(),
      tag: tag || "General",
      link: link || "",
      isActive: isActive !== false,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
exports.updateAnnouncement = async (req, res) => {
  try {
    const { text, tag, link, isActive } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    if (text !== undefined) announcement.text = text.trim();
    if (tag !== undefined) announcement.tag = tag;
    if (link !== undefined) announcement.link = link;
    if (isActive !== undefined) announcement.isActive = isActive;

    await announcement.save();

    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
