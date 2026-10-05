const express = require("express");
const { submitContact, getContacts, updateContactStatus } = require("../controllers/contactController");
const { protectAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route - submit contact form
router.post("/submit", submitContact);

// Admin routes - get all contacts and update status
router.get("/", protectAdmin, getContacts);
router.patch("/:id/status", protectAdmin, updateContactStatus);

module.exports = router;
