const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  convertLeadToCustomer,
  getLeadStats,
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
  createDeal,
  getDeals,
  getDealsByStage,
  getDeal,
  updateDeal,
  updateDealStage,
  deleteDeal,
  getDealStats,
} = require("../controllers/crmDealController");

const {
  createQuotation,
  getQuotations,
  getQuotation,
  updateQuotation,
  sendQuotation,
  acceptQuotation,
  rejectQuotation,
  deleteQuotation,
  getQuotationStats,
} = require("../controllers/crmQuotationController");

const {
  getDashboardStats,
  getSalesReport,
  getSourceReport,
} = require("../controllers/crmDashboardController");

const { protectAdmin } = require("../middleware/authMiddleware");

// Dashboard Routes
router.route("/dashboard").get(protectAdmin, getDashboardStats);

// Lead Routes
router
  .route("/leads")
  .post(protectAdmin, createLead)
  .get(protectAdmin, getLeads);

router.route("/leads/stats").get(protectAdmin, getLeadStats);
router.route("/leads/:id").get(protectAdmin, getLead);
router.route("/leads/:id").put(protectAdmin, updateLead);
router.route("/leads/:id").delete(protectAdmin, deleteLead);
router.route("/leads/:id/convert").post(protectAdmin, convertLeadToCustomer);

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

// Deal Routes
router
  .route("/deals")
  .post(protectAdmin, createDeal)
  .get(protectAdmin, getDeals);

router.route("/deals/stats").get(protectAdmin, getDealStats);
router.route("/deals/pipeline").get(protectAdmin, getDealsByStage);
router.route("/deals/:id").get(protectAdmin, getDeal);
router.route("/deals/:id").put(protectAdmin, updateDeal);
router.route("/deals/:id/stage").put(protectAdmin, updateDealStage);
router.route("/deals/:id").delete(protectAdmin, deleteDeal);

// Quotation Routes
router
  .route("/quotations")
  .post(protectAdmin, createQuotation)
  .get(protectAdmin, getQuotations);

router.route("/quotations/stats").get(protectAdmin, getQuotationStats);
router.route("/quotations/:id").get(protectAdmin, getQuotation);
router.route("/quotations/:id").put(protectAdmin, updateQuotation);
router.route("/quotations/:id/send").put(protectAdmin, sendQuotation);
router.route("/quotations/:id/accept").put(protectAdmin, acceptQuotation);
router.route("/quotations/:id/reject").put(protectAdmin, rejectQuotation);
router.route("/quotations/:id").delete(protectAdmin, deleteQuotation);

// Reports Routes
router.route("/reports/sales").get(protectAdmin, getSalesReport);
router.route("/reports/sources").get(protectAdmin, getSourceReport);

module.exports = router;
