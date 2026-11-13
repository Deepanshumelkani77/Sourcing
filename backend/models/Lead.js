const mongoose = require("mongoose");

const YES_NO = ["", "Yes", "No"];

const leadSchema = new mongoose.Schema(
  {
    leadNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    /* ---------------- Person / contact ---------------- */
    salutation: {
      type: String,
      trim: true,
      enum: ["", "Mr.", "Ms.", "Mrs.", "Dr.", "Prof."],
      default: "",
    },
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    customerName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, trim: true, default: "" },
    phone: { type: String, required: true, trim: true },
    alternatePhone: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    alternateEmail: { type: String, trim: true, lowercase: true, default: "" },

    /* ---------------- Communication preferences & consent ---------------- */
    preferredContactMethod: {
      type: String,
      enum: ["", "Call", "WhatsApp", "Email", "Meeting"],
      default: "",
    },
    preferredLanguage: {
      type: String,
      enum: ["", "English", "Hindi", "Other"],
      default: "",
    },
    bestTimeToContact: { type: String, trim: true, default: "" },
    marketingConsent: { type: String, enum: YES_NO, default: "" },
    consentDate: { type: Date },
    doNotCall: { type: Boolean, default: false },
    doNotWhatsApp: { type: Boolean, default: false },

    /* ---------------- Company & location ---------------- */
    companyName: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    jobTitle: { type: String, trim: true, default: "" },
    department: {
      type: String,
      enum: ["", "Purchase", "Projects", "Operations", "Finance", "Marketing"],
      default: "",
    },
    industry: {
      type: String,
      enum: [
        "",
        "Manufacturing",
        "Construction",
        "Real Estate",
        "Hospitality",
        "Retail",
        "Export / Import",
        "Automotive",
        "Electronics",
        "Textile",
        "Other",
      ],
      default: "",
    },
    companyType: {
      type: String,
      enum: [
        "",
        "Proprietorship",
        "Pvt. Ltd.",
        "LLP",
        "Partnership",
        "Individual",
        "Government",
        "Other",
      ],
      default: "",
    },
    companySize: {
      type: String,
      enum: ["", "1-10", "11-50", "51-200", "200+"],
      default: "",
    },
    annualRevenue: {
      type: String,
      enum: ["", "Below ₹1 Crore", "₹1-10 Crore", "₹10-50 Crore", "₹50 Crore+"],
      default: "",
    },
    address: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "India" },
    pincode: { type: String, trim: true, default: "" },

    /* ---------------- Requirement ---------------- */
    productInterest: { type: String, trim: true, default: "" },
    productRequirement: { type: String, required: true, trim: true },
    productCategory: { type: String, trim: true, default: "" },
    productSpecifications: { type: String, trim: true, default: "" },
    servicesInterested: [{ type: String, trim: true }],
    quantity: { type: String, trim: true, default: "" },
    quantityUnit: {
      type: String,
      enum: ["", "Pieces", "Boxes", "Sets", "Kg", "Tons", "Sq. Ft.", "Sq. Mtr.", "20ft Container", "40ft Container"],
      default: "",
    },
    targetPrice: { type: String, trim: true, default: "" },
    budgetRange: {
      type: String,
      enum: ["", "Below ₹1 Lakh", "₹1-5 Lakh", "₹5-25 Lakh", "₹25 Lakh+", "Not Disclosed"],
      default: "",
    },
    requiredDeliveryDate: { type: Date },
    destinationCountry: { type: String, trim: true, default: "" },
    siteLocation: { type: String, trim: true, default: "" },
    shippingTerms: {
      type: String,
      enum: ["", "EXW", "FOB", "CIF", "DDP", "Not decided"],
      default: "",
    },
    projectName: { type: String, trim: true, default: "" },
    documentsRequired: { type: String, trim: true, default: "" },
    samplesRequired: { type: String, enum: YES_NO, default: "" },
    siteVisitRequired: { type: String, enum: YES_NO, default: "" },
    requirementDetails: { type: String, trim: true, default: "" },

    /* ---------------- Qualification ---------------- */
    qualificationStatus: {
      type: String,
      enum: ["Not Qualified", "Pending", "Qualified", "Disqualified"],
      default: "Pending",
    },
    qualificationFramework: {
      type: String,
      enum: ["", "BANT", "CHAMP", "MEDDIC", "Custom"],
      default: "",
    },
    requirementIdentified: { type: String, enum: ["", "Yes", "No", "Partially"], default: "" },
    productFit: {
      type: String,
      enum: ["", "High", "Medium", "Low", "Not Applicable"],
      default: "",
    },
    budgetAvailable: {
      type: String,
      enum: ["", "Confirmed", "Likely", "Not Available", "Unknown"],
      default: "",
    },
    purchaseAuthority: {
      type: String,
      enum: ["", "Decision Maker", "Influencer", "Recommender", "End User", "Unknown"],
      default: "",
    },
    decisionMakerConfirmed: { type: String, enum: YES_NO, default: "" },
    purchaseTimeline: {
      type: String,
      enum: ["", "Immediate", "Within 1 Month", "1–3 Months", "3–6 Months", "6–12 Months", "Not Decided"],
      default: "",
    },
    urgencyLevel: { type: String, enum: ["", "High", "Medium", "Low"], default: "" },

    decisionMakerName: { type: String, trim: true, default: "" },
    decisionMakerDesignation: { type: String, trim: true, default: "" },
    decisionMakerContact: { type: String, trim: true, default: "" },
    decisionRole: {
      type: String,
      enum: ["", "Decision Maker", "Influencer", "End User", "Procurement", "Finance"],
      default: "",
    },
    numberOfDecisionMakers: { type: Number, default: null },

    expectedOrderValue: { type: Number, default: 0, min: 0 },
    expectedOrderCurrency: {
      type: String,
      enum: ["", "INR", "USD", "CNY", "AED", "EUR"],
      default: "INR",
    },
    expectedClosingDate: { type: Date },
    probabilityOfClosure: { type: Number, default: null, min: 0, max: 100 },
    paymentTerms: {
      type: String,
      enum: ["", "Advance", "Partial Advance", "Credit", "COD", "Bank Transfer", "LC"],
      default: "",
    },
    creditRequirement: {
      type: String,
      enum: ["", "None", "Short Credit", "Long Credit", "To Be Discussed"],
      default: "",
    },

    painPoint: { type: String, trim: true, default: "" },
    currentSupplier: { type: String, trim: true, default: "" },
    supplierSatisfaction: {
      type: String,
      enum: ["", "Satisfied", "Dissatisfied", "Neutral", "Unknown"],
      default: "",
    },
    competitorQuoted: { type: String, trim: true, default: "" },
    competitorPrice: { type: String, trim: true, default: "" },
    qualificationRemarks: { type: String, trim: true, default: "" },
    disqualificationReason: {
      type: String,
      enum: [
        "",
        "No Budget",
        "No Requirement",
        "Wrong Product",
        "Invalid Contact",
        "Duplicate",
        "Not Interested",
        "Outside Service Area",
        "Spam / Test Enquiry",
      ],
      default: "",
    },

    /* ---------------- Pipeline / follow-up ---------------- */
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Follow-Up",
        "Interested",
        "Site Visit",
        "Quotation Sent",
        "Negotiation",
        "Qualified",
        "Won",
        "Lost",
        "Junk",
        "Duplicate",
      ],
      default: "New",
    },
    leadStage: {
      type: String,
      enum: [
        "",
        "Fresh",
        "Working",
        "Nurturing",
        "Qualified",
        "Opportunity Created",
        "Converted",
        "Disqualified",
      ],
      default: "",
    },
    leadRating: { type: String, enum: ["", "Hot", "Warm", "Cold"], default: "" },
    leadGrade: { type: String, enum: ["", "A", "B", "C", "D"], default: "" },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent", "P1 - Hot", "P2 - Warm", "P3 - Cold", "P4 - Nurture"],
      default: "Medium",
    },
    nextAction: {
      type: String,
      enum: ["", "Call", "Send Quotation", "Share Catalogue", "Schedule Visit", "Negotiate"],
      default: "",
    },
    nextActionOwner: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    followUpDate: { type: Date },
    followUpSequence: {
      type: String,
      enum: ["", "First Call", "Second Call", "Reminder", "Final Follow-Up"],
      default: "",
    },
    nextReviewDate: { type: Date },
    firstResponseDate: { type: Date },
    firstResponseMode: {
      type: String,
      enum: ["", "Call", "WhatsApp", "Email", "Meeting", "Site Visit"],
      default: "",
    },
    lastContactDate: { type: Date },
    lastContactMethod: {
      type: String,
      enum: ["", "Call", "WhatsApp", "Email", "Meeting", "Site Visit"],
      default: "",
    },
    numberOfFollowUps: { type: Number, default: 0, min: 0 },
    communicationStatus: {
      type: String,
      enum: ["", "Not Contacted", "Contacted", "Awaiting Reply", "Engaged", "Stopped Responding"],
      default: "",
    },

    /* ---------------- Source & ownership ---------------- */
    source: { type: String, trim: true, default: "Website" },
    subSource: { type: String, trim: true, default: "" },
    dataSource: {
      type: String,
      enum: ["", "Website", "Manual Entry", "Import", "API", "WhatsApp", "Advertisement"],
      default: "",
    },
    leadCapturedBy: {
      type: String,
      enum: ["", "Reception", "Salesperson", "Website", "Chatbot"],
      default: "",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    assignedTeam: {
      type: String,
      enum: ["", "Sales", "Export", "Retail", "Projects", "Customer Support"],
      default: "",
    },
    assignedRegion: { type: String, trim: true, default: "" },
    referralName: { type: String, trim: true, default: "" },
    referralContact: { type: String, trim: true, default: "" },

    /* ---------------- Campaign tracking ---------------- */
    campaignName: { type: String, trim: true, default: "" },
    utmSource: { type: String, trim: true, default: "" },
    utmMedium: { type: String, trim: true, default: "" },
    utmCampaign: { type: String, trim: true, default: "" },
    landingPageUrl: { type: String, trim: true, default: "" },

    /* ---------------- Notes ---------------- */
    notes: { type: String, trim: true, default: "" },

    /* ---------------- Scoring ---------------- */
    leadScore: { type: Number, default: 0, min: 0, max: 100 },
    scoreBreakdown: {
      fit: { type: Number, default: 0 },
      engagement: { type: Number, default: 0 },
      salesReadiness: { type: Number, default: 0 },
      negative: { type: Number, default: 0 },
    },

    /* ---------------- Conversion & outcome ---------------- */
    conversionStatus: {
      type: String,
      enum: ["Not Converted", "Converted to Opportunity", "Converted to Customer", "Lost"],
      default: "Not Converted",
    },
    dealValue: { type: Number, default: 0 },
    revenueBooked: { type: Number, default: 0 },
    actualClosingDate: { type: Date },
    wonLostReason: { type: String, trim: true, default: "" },
    lostCompetitor: { type: String, trim: true, default: "" },
    convertedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    conversionDate: { type: Date },
    convertedToCustomer: { type: Boolean, default: false },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    dealId: { type: mongoose.Schema.Types.ObjectId, ref: "Deal" },

    duplicateCheckStatus: { type: String, trim: true, default: "" },
    duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  {
    timestamps: true,
  }
);

leadSchema.pre("save", function (next) {
  if (!this.leadNumber) {
    const d = new Date();
    const year = d.getFullYear().toString().slice(-2);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const rand = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
    this.leadNumber = `LD${year}${month}${day}${rand}`;
  }
  next();
});

leadSchema.index({ status: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ leadRating: 1 });
leadSchema.index({ leadNumber: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ qualificationStatus: 1 });

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
