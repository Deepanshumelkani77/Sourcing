const mongoose = require("mongoose");
const Service = require("./models/Service");
require("dotenv").config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

// Service data based on current Services.jsx
const servicesData = [
  // Phase 1: Source
  {
    phaseId: "source",
    phaseNumber: "01",
    phaseName: "Source",
    phaseTagline: "Find and vet the right manufacturers",
    serviceId: "supplier-identification",
    serviceNumber: "01",
    serviceTitle: "Supplier Identification",
    serviceDescription: "Find suitable manufacturers that match your requirements.",
    serviceDetails: "We identify suitable manufacturers based on your product specifications, quantity, quality requirements, target pricing and destination.",
    included: [
      "Manufacturer search",
      "Capability matching",
      "MOQ comparison",
      "Price comparison",
      "Initial supplier screening"
    ],
    deliverable: "A shortlist of potential suppliers with relevant supplier information for your evaluation.",
    order: 1,
    status: "active",
    translations: []
  },
  {
    phaseId: "source",
    phaseNumber: "01",
    phaseName: "Source",
    phaseTagline: "Find and vet the right manufacturers",
    serviceId: "supplier-evaluation",
    serviceNumber: "02",
    serviceTitle: "Supplier Evaluation & Verification",
    serviceDescription: "Evaluate capability, experience, capacity, pricing and reliability.",
    serviceDetails: "We conduct comprehensive supplier verification including factory audits, capability assessment, financial stability review, and quality system evaluation.",
    included: [
      "Factory audits",
      "Capability assessment",
      "Financial verification",
      "Quality system review",
      "Reliability assessment"
    ],
    deliverable: "Detailed supplier evaluation report with verification results and recommendations.",
    order: 2,
    status: "active",
    translations: []
  },
  // Phase 2: Sample
  {
    phaseId: "sample",
    phaseNumber: "02",
    phaseName: "Sample",
    phaseTagline: "Test and approve before you commit",
    serviceId: "sample-inspection",
    serviceNumber: "03",
    serviceTitle: "Sample Inspection",
    serviceDescription: "Inspect samples before production.",
    serviceDetails: "Our quality experts inspect production samples against your specifications, quality standards, and technical requirements before mass production begins.",
    included: [
      "Visual inspection",
      "Dimensional verification",
      "Material testing",
      "Functionality testing",
      "Documentation review"
    ],
    deliverable: "Sample inspection report with detailed findings and photographs.",
    order: 3,
    status: "active",
    translations: []
  },
  {
    phaseId: "sample",
    phaseNumber: "02",
    phaseName: "Sample",
    phaseTagline: "Test and approve before you commit",
    serviceId: "buyer-sample-approval",
    serviceNumber: "04",
    serviceTitle: "Buyer Sample Approval",
    serviceDescription: "Send the sample/evidence to the buyer for approval.",
    serviceDetails: "We coordinate the sample submission process, provide inspection evidence, and facilitate your approval decision with comprehensive documentation.",
    included: [
      "Sample coordination",
      "Evidence documentation",
      "Approval facilitation",
      "Change management",
      "Approval tracking"
    ],
    deliverable: "Sample approval documentation with inspection evidence and status.",
    order: 4,
    status: "active",
    translations: []
  },
  // Phase 3: Order & Production
  {
    phaseId: "order",
    phaseNumber: "03",
    phaseName: "Order & Production",
    phaseTagline: "Lock in terms and track every milestone",
    serviceId: "order-placement",
    serviceNumber: "05",
    serviceTitle: "Order Placement",
    serviceDescription: "Coordinate purchase order placement with the approved supplier.",
    serviceDetails: "We manage the entire order placement process including PO preparation, supplier confirmation, and timeline establishment.",
    included: [
      "PO preparation",
      "Supplier confirmation",
      "Timeline establishment",
      "Terms negotiation",
      "Order documentation"
    ],
    deliverable: "Confirmed purchase order with agreed terms and delivery schedule.",
    order: 5,
    status: "active",
    translations: []
  },
  {
    phaseId: "order",
    phaseNumber: "03",
    phaseName: "Order & Production",
    phaseTagline: "Lock in terms and track every milestone",
    serviceId: "contract-documentation",
    serviceNumber: "06",
    serviceTitle: "Contract & Documentation",
    serviceDescription: "Coordinate contracts, specifications, commercial terms and required documentation.",
    serviceDetails: "We prepare and manage all necessary contracts, specifications, commercial terms, and export/import documentation.",
    included: [
      "Contract preparation",
      "Specification documents",
      "Commercial terms",
      "Export documentation",
      "Import documentation"
    ],
    deliverable: "Complete contract and documentation package for legal and operational use.",
    order: 6,
    status: "active",
    translations: []
  },
  {
    phaseId: "order",
    phaseNumber: "03",
    phaseName: "Order & Production",
    phaseTagline: "Lock in terms and track every milestone",
    serviceId: "production-monitoring",
    serviceNumber: "07",
    serviceTitle: "Production Monitoring",
    serviceDescription: "Track production progress and communicate updates.",
    serviceDetails: "We monitor production progress at key milestones, conduct regular status checks, and provide timely updates on schedule adherence.",
    included: [
      "Production tracking",
      "Milestone monitoring",
      "Status reporting",
      "Issue resolution",
      "Schedule management"
    ],
    deliverable: "Regular production status reports with milestone progress and risk alerts.",
    order: 7,
    status: "active",
    translations: []
  },
  // Phase 4: Quality & Delivery
  {
    phaseId: "quality",
    phaseNumber: "04",
    phaseName: "Quality & Delivery",
    phaseTagline: "Verify, ship and receive with confidence",
    serviceId: "quality-inspection",
    serviceNumber: "08",
    serviceTitle: "Quality Inspection",
    serviceDescription: "Check production against agreed specifications and quality requirements.",
    serviceDetails: "Comprehensive quality inspection of finished goods against specifications, quality standards, and acceptance criteria.",
    included: [
      "Quality inspection",
      "Specification verification",
      "Defect detection",
      "Compliance checking",
      "Inspection reporting"
    ],
    deliverable: "Quality inspection report with defect analysis and acceptance status.",
    order: 8,
    status: "active",
    translations: []
  },
  {
    phaseId: "quality",
    phaseNumber: "04",
    phaseName: "Quality & Delivery",
    phaseTagline: "Verify, ship and receive with confidence",
    serviceId: "quantity-verification",
    serviceNumber: "09",
    serviceTitle: "Quantity Verification",
    serviceDescription: "Verify quantities, packing quantities and order fulfillment.",
    serviceDetails: "We verify shipment quantities, packing quantities, labeling compliance, and order fulfillment accuracy.",
    included: [
      "Quantity counting",
      "Packing verification",
      "Label checking",
      "Fulfillment verification",
      "Documentation check"
    ],
    deliverable: "Quantity verification report with packing and fulfillment details.",
    order: 9,
    status: "active",
    translations: []
  },
  {
    phaseId: "quality",
    phaseNumber: "04",
    phaseName: "Quality & Delivery",
    phaseTagline: "Verify, ship and receive with confidence",
    serviceId: "dispatch-coordination",
    serviceNumber: "10",
    serviceTitle: "Dispatch Coordination",
    serviceDescription: "Coordinate dispatch readiness and shipping handover.",
    serviceDetails: "We coordinate dispatch preparation, shipping documentation, carrier handover, and shipment tracking initiation.",
    included: [
      "Dispatch preparation",
      "Shipping documentation",
      "Carrier coordination",
      "Handover management",
      "Tracking setup"
    ],
    deliverable: "Dispatch confirmation with shipping documentation and tracking information.",
    order: 10,
    status: "active",
    translations: []
  },
  {
    phaseId: "quality",
    phaseNumber: "04",
    phaseName: "Quality & Delivery",
    phaseTagline: "Verify, ship and receive with confidence",
    serviceId: "local-transportation",
    serviceNumber: "11",
    serviceTitle: "Local Transportation",
    serviceDescription: "Coordinate movement of goods from supplier/factory to warehouse, consolidation point, port, etc.",
    serviceDetails: "We manage inland transportation including pickup from factory, consolidation, and delivery to port/warehouse.",
    included: [
      "Factory pickup",
      "Consolidation",
      "Inland transport",
      "Port delivery",
      "Warehousing coordination"
    ],
    deliverable: "Transportation coordination with tracking and delivery confirmation.",
    order: 11,
    status: "active",
    translations: []
  },
  {
    phaseId: "quality",
    phaseNumber: "04",
    phaseName: "Quality & Delivery",
    phaseTagline: "Verify, ship and receive with confidence",
    serviceId: "receiving-delivery",
    serviceNumber: "12",
    serviceTitle: "Receiving & Delivery",
    serviceDescription: "Coordinate receiving and final handover.",
    serviceDetails: "We coordinate final receiving, delivery confirmation, documentation handover, and completion verification.",
    included: [
      "Receiving coordination",
      "Delivery confirmation",
      "Documentation handover",
      "Completion verification",
      "Issue resolution"
    ],
    deliverable: "Delivery confirmation with complete documentation and completion report.",
    order: 12,
    status: "active",
    translations: []
  }
];

// Seed services
const seedServices = async () => {
  try {
    // Clear existing services
    await Service.deleteMany({});
    console.log("Cleared existing services");

    // Insert new services
    const insertedServices = await Service.insertMany(servicesData);
    console.log(`Inserted ${insertedServices.length} services`);

    console.log("Services seeded successfully!");
  } catch (error) {
    console.error("Error seeding services:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
const run = async () => {
  await connectDB();
  await seedServices();
};

run();
