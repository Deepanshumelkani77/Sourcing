const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  convertLeadToCustomer,
  bulkCreateLeads,
  getLeadStats,
  updateLeadStatus,
  getEmployeesForAssignment,
  getLeadActivities,
  createLeadActivity,
  deleteLeadActivity,
} = require("../controllers/crmLeadController");

const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
} = require("../controllers/crmCustomerController");

const {
  createFollowUp,
  getFollowUps,
  getTodayFollowUps,
  getOverdueFollowUps,
  getFollowUp,
  updateFollowUp,
  completeFollowUp,
  deleteFollowUp,
  getFollowUpStats,
} = require("../controllers/crmFollowUpController");

const {
  getDashboardStats,
  getSourceReport,
} = require("../controllers/crmDashboardController");

const { protectAdmin } = require("../middleware/authMiddleware");

// Dashboard Routes
router.route("/dashboard").get(protectAdmin, getDashboardStats);

// Get employees for lead assignment
router.route("/employees").get(protectAdmin, getEmployeesForAssignment);

// Lead Routes
router
  .route("/leads")
  .post(protectAdmin, createLead)
  .get(protectAdmin, getLeads);

router.route("/leads/bulk").post(protectAdmin, bulkCreateLeads);
router.route("/leads/stats").get(protectAdmin, getLeadStats);
router.route("/leads/:id").get(protectAdmin, getLead);
router.route("/leads/:id").put(protectAdmin, updateLead);
router.route("/leads/:id").delete(protectAdmin, deleteLead);
router.route("/leads/:id/convert").post(protectAdmin, convertLeadToCustomer);
router.route("/leads/:id/status").put(protectAdmin, updateLeadStatus);
router.route("/leads/:id/activities").get(protectAdmin, getLeadActivities).post(protectAdmin, createLeadActivity);
router.route("/leads/:id/activities/:activityId").delete(protectAdmin, deleteLeadActivity);

// Customer Routes
router
  .route("/customers")
  .post(protectAdmin, createCustomer)
  .get(protectAdmin, getCustomers);

router.route("/customers/stats").get(protectAdmin, getCustomerStats);
router.route("/customers/:id").get(protectAdmin, getCustomer);
router.route("/customers/:id").put(protectAdmin, updateCustomer);
router.route("/customers/:id").delete(protectAdmin, deleteCustomer);

// Follow-up Routes
router
  .route("/followups")
  .post(protectAdmin, createFollowUp)
  .get(protectAdmin, getFollowUps);

router.route("/followups/stats").get(protectAdmin, getFollowUpStats);
router.route("/followups/today").get(protectAdmin, getTodayFollowUps);
router.route("/followups/overdue").get(protectAdmin, getOverdueFollowUps);
router.route("/followups/:id").get(protectAdmin, getFollowUp);
router.route("/followups/:id").put(protectAdmin, updateFollowUp);
router.route("/followups/:id/complete").put(protectAdmin, completeFollowUp);
router.route("/followups/:id").delete(protectAdmin, deleteFollowUp);

// Reports Routes
router.route("/reports/sources").get(protectAdmin, getSourceReport);

module.exports = router;
