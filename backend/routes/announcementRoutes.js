const express = require("express");
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");
const { protectAdmin } = require("../middleware/authMiddleware");

router.route("/").get(protectAdmin, getAnnouncements).post(protectAdmin, createAnnouncement);
router.route("/:id").put(protectAdmin, updateAnnouncement).delete(protectAdmin, deleteAnnouncement);

module.exports = router;
