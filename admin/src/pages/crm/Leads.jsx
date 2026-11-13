import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../config/axios'

/* ================================================================== */
/* Option lists                                                       */
/* ================================================================== */
const LEAD_SOURCES = [
  'Website', 'Google Ads', 'Meta Ads', 'Organic Search', 'IndiaMART', 'Alibaba', 'WhatsApp', 'Exhibition',
  'Walk-in', 'Referral', 'LinkedIn', 'Cold Calling', 'Manual Entry', 'Email', 'Phone', 'Chatbot', 'Other'
]
const STATUSES = ['New', 'Contacted', 'Follow-Up', 'Interested', 'Site Visit', 'Quotation Sent', 'Negotiation', 'Qualified', 'Won', 'Lost', 'Junk', 'Duplicate']
const CLOSED_STATUSES = ['Won', 'Lost', 'Junk', 'Duplicate']
const STAGES = ['Fresh', 'Working', 'Nurturing', 'Qualified', 'Opportunity Created', 'Converted', 'Disqualified']
const RATINGS = ['Hot', 'Warm', 'Cold']
const PRIORITIES = ['P1 - Hot', 'P2 - Warm', 'P3 - Cold', 'P4 - Nurture', 'Low', 'Medium', 'High', 'Urgent']
const NEXT_ACTIONS = ['Call', 'Send Quotation', 'Share Catalogue', 'Schedule Visit', 'Negotiate']
const CONTACT_METHODS = ['Call', 'WhatsApp', 'Email', 'Meeting', 'Site Visit']
const PREFERRED_METHODS = ['Call', 'WhatsApp', 'Email', 'Meeting']
const ACTIVITY_TYPES = ['Call Log', 'WhatsApp Log', 'Email Log', 'Meeting Log', 'Site-Visit Log', 'Quotation Log', 'Document', 'Activity Outcome', 'Note']
const QUICK_LOG = [['Call Log', 'Call'], ['WhatsApp Log', 'WhatsApp'], ['Email Log', 'Email'], ['Meeting Log', 'Meeting'], ['Note', 'Note']]

const YES_NO = ['Yes', 'No']
const SALUTATIONS = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.']
const LANGUAGES = ['English', 'Hindi', 'Other']
const DEPARTMENTS = ['Purchase', 'Projects', 'Operations', 'Finance', 'Marketing']
const INDUSTRIES = ['Manufacturing', 'Construction', 'Real Estate', 'Hospitality', 'Retail', 'Export / Import', 'Automotive', 'Electronics', 'Textile', 'Other']
const COMPANY_TYPES = ['Proprietorship', 'Pvt. Ltd.', 'LLP', 'Partnership', 'Individual', 'Government', 'Other']
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '200+']
const REVENUES = ['Below ₹1 Crore', '₹1-10 Crore', '₹10-50 Crore', '₹50 Crore+']
const DATA_SOURCES = ['Website', 'Manual Entry', 'Import', 'API', 'WhatsApp', 'Advertisement']
const CAPTURED_BY = ['Reception', 'Salesperson', 'Website', 'Chatbot']
const UNITS = ['Pieces', 'Boxes', 'Sets', 'Kg', 'Tons', 'Sq. Ft.', 'Sq. Mtr.', '20ft Container', '40ft Container']
const BUDGET_RANGES = ['Below ₹1 Lakh', '₹1-5 Lakh', '₹5-25 Lakh', '₹25 Lakh+', 'Not Disclosed']
const CURRENCIES = ['INR', 'USD', 'CNY', 'AED', 'EUR']
const SHIPPING_TERMS = ['EXW', 'FOB', 'CIF', 'DDP', 'Not decided']
const PAYMENT_TERMS = ['Advance', 'Partial Advance', 'Credit', 'COD', 'Bank Transfer', 'LC']
const CREDIT = ['None', 'Short Credit', 'Long Credit', 'To Be Discussed']
const PROBABILITIES = [10, 25, 50, 75, 90].map((n) => ({ value: n, label: `${n}%` }))
const QUALIFICATION_STATUSES = ['Not Qualified', 'Pending', 'Qualified', 'Disqualified']
const FRAMEWORKS = ['BANT', 'CHAMP', 'MEDDIC', 'Custom']
const FIT = ['High', 'Medium', 'Low', 'Not Applicable']
const BUDGET_AVAILABLE = ['Confirmed', 'Likely', 'Not Available', 'Unknown']
const AUTHORITY = ['Decision Maker', 'Influencer', 'Recommender', 'End User', 'Unknown']
const DECISION_ROLES = ['Decision Maker', 'Influencer', 'End User', 'Procurement', 'Finance']
const TIMELINES = ['Immediate', 'Within 1 Month', '1–3 Months', '3–6 Months', '6–12 Months', 'Not Decided']
const NEAR_TIMELINES = ['Immediate', 'Within 1 Month', '1–3 Months']
const URGENCY = ['High', 'Medium', 'Low']
const SATISFACTION = ['Satisfied', 'Dissatisfied', 'Neutral', 'Unknown']
const DISQUALIFICATION_REASONS = ['No Budget', 'No Requirement', 'Wrong Product', 'Invalid Contact', 'Duplicate', 'Not Interested', 'Outside Service Area', 'Spam / Test Enquiry']
const WON_LOST_REASONS = ['Price', 'Quality', 'Delivery', 'Competitor', 'Budget', 'No Requirement', 'Other']
const CONVERSION_STATUSES = ['Not Converted', 'Converted to Opportunity', 'Converted to Customer', 'Lost']
const TEAMS = ['Sales', 'Export', 'Retail', 'Projects', 'Customer Support']
const FOLLOWUP_SEQUENCE = ['First Call', 'Second Call', 'Reminder', 'Final Follow-Up']
const COMM_STATUS = ['Not Contacted', 'Contacted', 'Awaiting Reply', 'Engaged', 'Stopped Responding']
const SERVICES = [
  'Supplier Identification', 'Supplier Evaluation & Verification', 'Sample Inspection', 'Buyer Sample Approval', 'Order Placement', 'Contract & Documentation',
  'Production Monitoring', 'Quality Inspection', 'Quantity Verification', 'Dispatch Coordination', 'Local Transportation', 'Receiving & Delivery'
]

/* ================================================================== */
/* Helpers                                                            */
/* ================================================================== */
const toDateInput = (d) => (d ? String(d).split('T')[0] : '')
const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const dayDiff = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  const target = new Date(y, m - 1, d)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.round((target - now) / 86400000)
}
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—')
const fmtDateTime = (d) => (d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '')
const fmtMoney = (v, cur = 'INR') => {
  if (v === '' || v === null || v === undefined || Number(v) === 0) return '—'
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: cur || 'INR', maximumFractionDigits: 0 }).format(Number(v))
  } catch (e) {
    return `${cur} ${v}`
  }
}

const digits = (v) => String(v || '').replace(/\D/g, '')
const last10 = (v) => digits(v).slice(-10)
// WhatsApp needs the country code. A bare 10-digit number is treated as Indian (+91).
const waNumber = (v) => {
  const d = digits(v).replace(/^0+/, '')
  return d.length === 10 ? `91${d}` : d
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isClosed = (l) => CLOSED_STATUSES.includes(l.status) || l.qualificationStatus === 'Disqualified' || l.leadStage === 'Disqualified'
const followDiff = (l) => (l.followUpDate ? dayDiff(toDateInput(l.followUpDate)) : null)

const dueInfo = (l) => {
  if (isClosed(l)) return null
  const d = followDiff(l)
  if (d === null) return { label: 'Not scheduled', tone: 'gray', overdue: false }
  if (d < 0) return { label: `Overdue ${Math.abs(d)}d`, tone: 'red', overdue: true }
  if (d === 0) return { label: 'Due today', tone: 'amber', overdue: false }
  if (d === 1) return { label: 'Tomorrow', tone: 'blue', overdue: false }
  return { label: `In ${d} days`, tone: 'gray', overdue: false }
}

const scoreBand = (s = 0) =>
  s >= 80 ? { label: 'Hot lead', color: '#F41703', text: 'Senior salesperson, same-day call, prepare the quotation.' }
  : s >= 60 ? { label: 'Good lead', color: '#F97316', text: 'Follow up within 24 hours and qualify budget and timeline.' }
  : s >= 40 ? { label: 'Moderate', color: '#D97706', text: 'Nurture: send the catalogue and relevant information.' }
  : s >= 20 ? { label: 'Low', color: '#0EA5E9', text: 'Verify contact details and follow up periodically.' }
  : { label: 'Very low', color: '#9CA3AF', text: 'Disqualify, archive or move to marketing nurture.' }

const nameOf = (l) => l.customerName || [l.firstName, l.lastName].filter(Boolean).join(' ') || 'Unnamed lead'
const ownerName = (l) => (l.assignedTo && typeof l.assignedTo === 'object' ? `${l.assignedTo.firstName || ''} ${l.assignedTo.lastName || ''}`.trim() || 'Unassigned' : 'Unassigned')
const initials = (name) => (name || '?').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || '?'

const csvCell = (v) => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const findDuplicates = (form, leads, selfId) => {
  const nums = [form.mobileNumber, form.alternatePhone].map(last10).filter((n) => n.length >= 7)
  const emails = [form.email].map((e) => (e || '').trim().toLowerCase()).filter((e) => EMAIL_RE.test(e))
  if (!nums.length && !emails.length) return []
  return leads
    .filter(
      (l) =>
        l._id !== selfId &&
        ([l.mobileNumber, l.phone, l.alternatePhone].map(last10).some((n) => n.length >= 7 && nums.includes(n)) ||
          [l.email, l.alternateEmail].map((e) => (e || '').trim().toLowerCase()).some((e) => e && emails.includes(e)))
    )
    .slice(0, 3)
}

/* ================================================================== */
/* Form definition: tabs > sections > fields                          */
/*   req   : true, or (form) => boolean                               */
/*   quick : shown in the short "Quick add" form                      */
/* ================================================================== */
const F = (name, label, type = 'text', extra = {}) => ({ name, label, type, ...extra })

const afterContact = (f) => f.status !== 'New' && !CLOSED_STATUSES.includes(f.status) && f.qualificationStatus !== 'Disqualified'
const whenQualified = (f) => f.qualificationStatus === 'Qualified' || f.status === 'Qualified'

const TABS = [
  {
    id: 'contact',
    label: 'Contact',
    sections: [
      {
        title: 'Person',
        fields: [
          F('salutation', 'Salutation', 'select', { options: SALUTATIONS }),
          F('firstName', 'First name', 'text', { req: true, quick: true }),
          F('lastName', 'Last name', 'text', { req: true, quick: true }),
          F('mobileNumber', 'Mobile number', 'tel', { req: true, quick: true, placeholder: '+91 98XXXXXXXX' }),
          F('alternatePhone', 'Alternate phone', 'tel'),
          F('whatsapp', 'WhatsApp number', 'tel', { help: 'sameAsMobile' }),
          F('email', 'Email', 'email', { quick: true, placeholder: 'name@company.com' }),
          F('alternateEmail', 'Alternate email', 'email')
        ]
      },
      {
        title: 'Communication & consent',
        fields: [
          F('preferredContactMethod', 'Preferred contact method', 'select', { options: PREFERRED_METHODS, req: true, quick: true }),
          F('companyName', 'Company / organisation', 'text', { quick: true }),
          F('preferredLanguage', 'Preferred language', 'select', { options: LANGUAGES }),
          F('bestTimeToContact', 'Best time to contact', 'text', { placeholder: 'e.g. 11 AM - 1 PM' }),
          F('marketingConsent', 'Marketing consent', 'select', { options: YES_NO, req: true, quick: true }),
          F('consentDate', 'Consent date', 'date', { req: (f) => f.marketingConsent === 'Yes' }),
          F('doNotCall', 'Do not call', 'check'),
          F('doNotWhatsApp', 'Do not WhatsApp', 'check')
        ]
      }
    ]
  },
  {
    id: 'company',
    label: 'Company & Location',
    sections: [
      {
        title: 'Company',
        fields: [
          F('website', 'Website / domain', 'text', { placeholder: 'https://example.com' }),
          F('jobTitle', 'Job title / designation', 'text'),
          F('department', 'Department', 'select', { options: DEPARTMENTS }),
          F('industry', 'Industry / business category', 'select', { options: INDUSTRIES }),
          F('companyType', 'Company type', 'select', { options: COMPANY_TYPES }),
          F('companySize', 'Company size (employees)', 'select', { options: COMPANY_SIZES }),
          F('annualRevenue', 'Annual revenue / turnover', 'select', { options: REVENUES })
        ]
      },
      {
        title: 'Location',
        fields: [
          F('address', 'Address', 'area', { span: true }),
          F('city', 'City', 'text', { req: true, quick: true }),
          F('state', 'State / province', 'text', { req: true, quick: true }),
          F('country', 'Country', 'text', { req: true, quick: true }),
          F('pincode', 'PIN / ZIP code', 'text')
        ]
      }
    ]
  },
  {
    id: 'requirement',
    label: 'Requirement',
    sections: [
      {
        title: 'What the customer needs',
        fields: [
          F('productInterest', 'Product / service interest', 'text', { req: true, quick: true }),
          F('productRequirement', 'Requirement details', 'text', { req: true, quick: true, span: 2, placeholder: 'What exactly does the customer want to buy or source?' }),
          F('productCategory', 'Product category', 'text'),
          F('productSpecifications', 'Product specifications', 'area', { span: true }),
          F('servicesInterested', 'Sourcing services needed', 'multi', { options: SERVICES, span: true })
        ]
      },
      {
        title: 'Quantity and budget',
        fields: [
          F('quantity', 'Quantity / volume', 'text'),
          F('quantityUnit', 'Unit', 'select', { options: UNITS }),
          F('targetPrice', 'Target price / budget', 'text'),
          F('budgetRange', 'Budget range', 'select', { options: BUDGET_RANGES }),
          F('requiredDeliveryDate', 'Required delivery date', 'date')
        ]
      },
      {
        title: 'Delivery and shipping',
        fields: [
          F('destinationCountry', 'Destination country', 'text'),
          F('siteLocation', 'Delivery / site location', 'text'),
          F('shippingTerms', 'Shipping terms', 'select', { options: SHIPPING_TERMS }),
          F('projectName', 'Project name', 'text'),
          F('documentsRequired', 'Documents required', 'text', { span: true, placeholder: 'e.g. Quotation, Catalogue, Technical specs' }),
          F('samplesRequired', 'Samples required', 'select', { options: YES_NO }),
          F('siteVisitRequired', 'Factory / site visit required', 'select', { options: YES_NO })
        ]
      }
    ]
  },
  {
    id: 'qualification',
    label: 'Qualification',
    sections: [
      {
        title: 'Qualification checklist',
        fields: [
          F('qualificationStatus', 'Qualification status', 'select', { options: QUALIFICATION_STATUSES }),
          F('qualificationFramework', 'Framework', 'select', { options: FRAMEWORKS }),
          F('requirementIdentified', 'Requirement identified', 'select', { options: ['Yes', 'No', 'Partially'], req: whenQualified }),
          F('productFit', 'Product / service fit', 'select', { options: FIT, req: whenQualified }),
          F('budgetAvailable', 'Budget available', 'select', { options: BUDGET_AVAILABLE, req: whenQualified }),
          F('purchaseAuthority', 'Purchase authority', 'select', { options: AUTHORITY, req: whenQualified }),
          F('decisionMakerConfirmed', 'Decision-maker confirmed', 'select', { options: YES_NO, req: whenQualified }),
          F('purchaseTimeline', 'Purchase timeline', 'select', { options: TIMELINES, req: whenQualified }),
          F('urgencyLevel', 'Urgency level', 'select', { options: URGENCY, req: whenQualified })
        ]
      },
      {
        title: 'Decision maker',
        fields: [
          F('decisionMakerName', 'Decision-maker name', 'text'),
          F('decisionMakerDesignation', 'Designation', 'text'),
          F('decisionMakerContact', 'Contact', 'text'),
          F('decisionRole', 'Decision role', 'select', { options: DECISION_ROLES }),
          F('numberOfDecisionMakers', 'Number of decision-makers', 'number')
        ]
      },
      {
        title: 'Commercials',
        fields: [
          F('expectedOrderValue', 'Expected order value', 'number', { req: whenQualified }),
          F('expectedOrderCurrency', 'Currency', 'select', { options: CURRENCIES }),
          F('expectedClosingDate', 'Expected closing date', 'date', { req: whenQualified }),
          F('probabilityOfClosure', 'Probability of closure', 'select', { options: PROBABILITIES }),
          F('paymentTerms', 'Payment terms required', 'select', { options: PAYMENT_TERMS }),
          F('creditRequirement', 'Credit requirement', 'select', { options: CREDIT })
        ]
      },
      {
        title: 'Context and competition',
        fields: [
          F('painPoint', 'Pain point / business challenge', 'area', { span: true }),
          F('currentSupplier', 'Current solution / supplier', 'text'),
          F('supplierSatisfaction', 'Supplier satisfaction', 'select', { options: SATISFACTION }),
          F('competitorQuoted', 'Competitor quoted', 'text'),
          F('competitorPrice', 'Competitor price', 'text')
        ]
      },
      {
        title: 'Outcome',
        fields: [
          F('qualificationRemarks', 'Qualification remarks', 'area', { span: true }),
          F('disqualificationReason', 'Disqualification reason', 'select', { options: DISQUALIFICATION_REASONS, req: true, showIf: (f) => f.qualificationStatus === 'Disqualified' })
        ]
      }
    ]
  },
  {
    id: 'followup',
    label: 'Follow-Up & Ownership',
    sections: [
      {
        title: 'Pipeline',
        fields: [
          F('status', 'Lead status', 'select', { options: STATUSES }),
          F('leadStage', 'Lead stage', 'select', { options: STAGES, req: afterContact }),
          F('leadRating', 'Lead rating', 'select', { options: RATINGS, req: afterContact }),
          F('priority', 'Lead priority', 'select', { options: PRIORITIES })
        ]
      },
      {
        title: 'Ownership',
        fields: [
          F('assignedTeam', 'Assigned team', 'select', { options: TEAMS }),
          F('assignedRegion', 'Assigned region / branch', 'text')
        ]
      },
      {
        title: 'Next step',
        fields: [
          F('nextAction', 'Next action', 'select', { options: NEXT_ACTIONS, req: afterContact }),
          F('nextActionOwner', 'Next action owner', 'employee', { req: afterContact }),
          F('followUpDate', 'Next follow-up date', 'date', { req: afterContact }),
          F('followUpSequence', 'Follow-up sequence', 'select', { options: FOLLOWUP_SEQUENCE }),
          F('nextReviewDate', 'Next review date', 'date')
        ]
      },
      {
        title: 'Contact history',
        fields: [
          F('firstResponseDate', 'First response date', 'date'),
          F('firstResponseMode', 'First response mode', 'select', { options: CONTACT_METHODS }),
          F('lastContactDate', 'Last contact date', 'date'),
          F('lastContactMethod', 'Last contact method', 'select', { options: CONTACT_METHODS }),
          F('numberOfFollowUps', 'Number of follow-ups', 'number'),
          F('communicationStatus', 'Communication status', 'select', { options: COMM_STATUS })
        ]
      }
    ]
  },
  {
    id: 'source',
    label: 'Source & Notes',
    sections: [
      {
        title: 'Lead source',
        fields: [
          F('source', 'Lead source', 'select', { options: LEAD_SOURCES, req: true, quick: true }),
          F('assignedTo', 'Lead owner', 'employee', { quick: true, help: 'Leave empty to assign later' }),
          F('leadCapturedBy', 'Lead captured by', 'select', { options: CAPTURED_BY, req: true, quick: true }),
          F('subSource', 'Sub source', 'text'),
          F('dataSource', 'Data source system', 'select', { options: DATA_SOURCES }),
          F('referralName', 'Referral name', 'text', { showIf: (f) => f.source === 'Referral' }),
          F('referralContact', 'Referral contact', 'text', { showIf: (f) => f.source === 'Referral' })
        ]
      },
      {
        title: 'Campaign tracking',
        fields: [
          F('campaignName', 'Campaign name', 'text'),
          F('utmSource', 'UTM source', 'text'),
          F('utmMedium', 'UTM medium', 'text'),
          F('utmCampaign', 'UTM campaign', 'text'),
          F('landingPageUrl', 'Landing page / form URL', 'text', { span: true })
        ]
      },
      {
        title: 'Notes',
        fields: [F('notes', 'Remarks', 'area', { span: true, rows: 4 })]
      },
      {
        title: 'Conversion and outcome',
        show: (f, editing) => editing || ['Won', 'Lost'].includes(f.status),
        fields: [
          F('conversionStatus', 'Conversion status', 'select', { options: CONVERSION_STATUSES }),
          F('dealValue', 'Deal value', 'number'),
          F('revenueBooked', 'Revenue booked', 'number'),
          F('actualClosingDate', 'Actual closing date', 'date'),
          F('wonLostReason', 'Won / lost reason', 'select', { options: WON_LOST_REASONS, req: (f) => ['Won', 'Lost'].includes(f.status) }),
          F('lostCompetitor', 'Lost to competitor', 'text', { showIf: (f) => f.status === 'Lost' })
        ]
      }
    ]
  }
]

const ALL_FIELDS = TABS.flatMap((t) => t.sections.flatMap((s) => s.fields.map((f) => ({ ...f, tab: t.id, section: s }))))
const NUMBER_ZERO = ['expectedOrderValue', 'numberOfFollowUps', 'dealValue', 'revenueBooked'] // existing behaviour: empty becomes 0
const NUMBER_NULL = ['numberOfDecisionMakers', 'probabilityOfClosure']
const DATE_FIELDS = ['followUpDate', 'requiredDeliveryDate', 'expectedClosingDate', 'lastContactDate', 'firstResponseDate', 'consentDate', 'nextReviewDate', 'actualClosingDate']

const emptyForm = () => {
  const base = {}
  ALL_FIELDS.forEach((f) => {
    base[f.name] = f.type === 'multi' ? [] : f.type === 'check' ? false : ''
  })
  return {
    ...base,
    customerName: '',
    phone: '',
    country: 'India',
    source: 'Manual Entry',
    dataSource: 'Manual Entry',
    leadCapturedBy: 'Salesperson',
    preferredContactMethod: 'Call',
    status: 'New',
    qualificationStatus: 'Pending',
    priority: 'Medium',
    expectedOrderCurrency: 'INR',
    conversionStatus: 'Not Converted'
  }
}

const formFromLead = (lead) => {
  const base = emptyForm()
  const out = { ...base }
  Object.keys(base).forEach((k) => {
    if (lead[k] !== undefined && lead[k] !== null) out[k] = lead[k]
  })
  out.assignedTo = lead.assignedTo?._id || lead.assignedTo || ''
  out.nextActionOwner = lead.nextActionOwner?._id || lead.nextActionOwner || ''
  DATE_FIELDS.forEach((k) => {
    out[k] = toDateInput(lead[k])
  })
  ;['expectedOrderValue', 'numberOfFollowUps', 'dealValue', 'revenueBooked'].forEach((k) => {
    out[k] = lead[k] ?? ''
  })
  // older leads only have a full name and a phone: split them so the new required fields are filled
  if (!out.firstName && !out.lastName && lead.customerName) {
    const parts = String(lead.customerName).trim().split(/\s+/)
    out.firstName = parts.shift() || ''
    out.lastName = parts.join(' ')
  }
  if (!out.mobileNumber && lead.phone) out.mobileNumber = lead.phone
  if (!Array.isArray(out.servicesInterested)) out.servicesInterested = []
  out.doNotCall = !!lead.doNotCall
  out.doNotWhatsApp = !!lead.doNotWhatsApp
  return out
}

const isRequired = (f, form) => (typeof f.req === 'function' ? f.req(form) : !!f.req)
const isVisible = (f, form) => !f.showIf || f.showIf(form)
const isEmpty = (v) => v === '' || v === null || v === undefined || (Array.isArray(v) && v.length === 0)

const validate = (form, mode, editing) => {
  const errors = {}
  ALL_FIELDS.forEach((f) => {
    if (!isVisible(f, form)) return
    if (f.section.show && !f.section.show(form, editing)) return
    if (mode === 'quick' && !f.quick) return
    if (isRequired(f, form) && isEmpty(form[f.name])) errors[f.name] = 'Required'
  })
  if (!errors.mobileNumber && form.mobileNumber) {
    const n = digits(form.mobileNumber).length
    if (n < 7 || n > 15) errors.mobileNumber = 'Enter a valid mobile number'
  }
  if (!errors.whatsapp && form.whatsapp && (digits(form.whatsapp).length < 7 || digits(form.whatsapp).length > 15)) errors.whatsapp = 'Enter a valid number'
  ;['email', 'alternateEmail'].forEach((k) => {
    if (!errors[k] && form[k] && !EMAIL_RE.test(form[k].trim())) errors[k] = 'Enter a valid email'
  })
  return errors
}

const buildPayload = (form) => {
  const p = { ...form }
  p.customerName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim() || form.customerName
  p.phone = form.phone || form.mobileNumber // keeps the existing required phone field filled
  ;['assignedTo', 'nextActionOwner'].forEach((k) => {
    if (!p[k]) p[k] = null
  })
  NUMBER_ZERO.forEach((k) => {
    p[k] = p[k] === '' ? 0 : Number(p[k])
  })
  NUMBER_NULL.forEach((k) => {
    p[k] = p[k] === '' ? null : Number(p[k])
  })
  DATE_FIELDS.forEach((k) => {
    p[k] = p[k] || null
  })
  return p
}

/* ================================================================== */
/* Colours                                                            */
/* ================================================================== */
const STATUS_COLORS = {
  New: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Contacted: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  'Follow-Up': 'bg-amber-50 text-amber-800 ring-amber-600/20',
  Interested: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20',
  'Site Visit': 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  'Quotation Sent': 'bg-purple-50 text-purple-700 ring-purple-600/20',
  Negotiation: 'bg-pink-50 text-pink-700 ring-pink-600/20',
  Qualified: 'bg-green-50 text-green-700 ring-green-600/20',
  Won: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Lost: 'bg-red-50 text-red-700 ring-red-600/20',
  Junk: 'bg-gray-100 text-gray-600 ring-gray-500/20',
  Duplicate: 'bg-gray-100 text-gray-600 ring-gray-500/20'
}
const RATING_COLORS = { Hot: 'bg-red-50 text-red-700 ring-red-600/20', Warm: 'bg-amber-50 text-amber-800 ring-amber-600/20', Cold: 'bg-sky-50 text-sky-700 ring-sky-600/20' }
const GRADE_COLORS = { A: 'bg-red-50 text-red-700 ring-red-600/20', B: 'bg-orange-50 text-orange-700 ring-orange-600/20', C: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20', D: 'bg-gray-100 text-gray-600 ring-gray-500/20' }
const TONE = {
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  gray: 'bg-gray-100 text-gray-600 ring-gray-500/20',
  green: 'bg-green-50 text-green-700 ring-green-600/20'
}

/* ================================================================== */
/* Icons                                                              */
/* ================================================================== */
const PATHS = {
  search: ['M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z', 'm21 21-4.3-4.3'],
  plus: ['M12 5v14M5 12h14'],
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3'],
  refresh: ['M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5'],
  phone: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'],
  message: ['M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'],
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm22 6-10 7L2 6'],
  eye: ['M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  pencil: ['M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z'],
  trash: ['M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6'],
  x: ['M18 6 6 18M6 6l12 12'],
  check: ['m5 13 4 4L19 7'],
  flame: ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'],
  clock: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7v5l3 2'],
  alert: ['M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4M12 17h.01'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'],
  userPlus: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M19 8v6M22 11h-6'],
  briefcase: ['M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z', 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
  file: ['M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z', 'M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8'],
  calendar: ['M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M16 2v4M8 2v4M3 10h18'],
  pin: ['M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  note: ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z'],
  chevron: ['m9 18 6-6-6-6'],
  inbox: ['M22 12h-6l-2 3h-4l-2-3H2', 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'],
  copy: ['M8 8h12v12H8z', 'M4 16V4h12']
}
const Icon = ({ name, className = 'h-4 w-4', sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {(PATHS[name] || []).map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
)

const ACTIVITY_ICON = { 'Call Log': 'phone', 'WhatsApp Log': 'message', 'Email Log': 'mail', 'Meeting Log': 'users', 'Site-Visit Log': 'pin', 'Quotation Log': 'file', Document: 'file', 'Activity Outcome': 'check', Note: 'note' }

/* ================================================================== */
/* Small UI pieces                                                    */
/* ================================================================== */
const ring = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F41703]'
const brandGrad = 'bg-gradient-to-r from-[#F41703] to-[#F97316]'

const Pill = ({ children, cls = TONE.gray }) => (
  <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${cls}`}>{children}</span>
)

const Avatar = ({ name, size = 'h-9 w-9 text-xs' }) => (
  <span className={`flex ${size} flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F41703] to-[#F97316] font-bold text-white`}>{initials(name)}</span>
)

const ScoreRing = ({ score = 0, size = 40, stroke = 4 }) => {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const color = scoreBand(score).color
  return (
    <span className="relative inline-flex flex-shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(100, score) / 100)} />
      </svg>
      <span className="absolute text-xs font-extrabold text-gray-800">{score}</span>
    </span>
  )
}

const Toasts = ({ items, dismiss }) => (
  <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex w-[min(92vw,380px)] flex-col gap-3" aria-live="polite">
    {items.map((t) => (
      <div key={t.id} role="status" className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-4 shadow-2xl ${t.type === 'error' ? 'border-red-200' : 'border-green-200'}`}>
        <span className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white ${t.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          <Icon name={t.type === 'error' ? 'alert' : 'check'} className="h-3.5 w-3.5" sw={3} />
        </span>
        <p className="flex-1 text-sm font-medium text-gray-800">{t.message}</p>
        <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-gray-400 hover:text-gray-600">
          <Icon name="x" className="h-4 w-4" />
        </button>
      </div>
    ))}
  </div>
)

const ConfirmDialog = ({ dialog, onCancel }) =>
  dialog && (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${dialog.danger ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-[#F41703]'}`}>
          <Icon name="alert" className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{dialog.title}</h3>
        <p className="mt-1.5 text-sm text-gray-600">{dialog.message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className={`rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 ${ring}`}>
            {dialog.cancelLabel || 'Cancel'}
          </button>
          <button onClick={dialog.onConfirm} className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${dialog.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-[#F41703] hover:bg-[#d31402]'} ${ring}`}>
            {dialog.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )

/* ------------------------------------------------------------------ */
/* One form field, drawn from the definition above                     */
/* ------------------------------------------------------------------ */
const FieldView = ({ f, form, update, error, employees }) => {
  const required = isRequired(f, form)
  const id = `f-${f.name}`
  const value = form[f.name]
  const base = `w-full rounded-md border bg-white px-2.5 py-1.5 text-[13px] text-gray-900 outline-none transition focus:ring-2 ${
    error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:border-[#F41703] focus:ring-[#F41703]/15'
  }`
  const wrap = f.span === 2 ? 'col-span-2' : f.span ? 'col-span-full' : ''

  if (f.type === 'check') {
    return (
      <label className={`flex cursor-pointer items-center gap-2 self-end rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 ${wrap}`}>
        <input id={id} type="checkbox" checked={!!value} onChange={(e) => update(f.name, e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#F41703] focus:ring-[#F41703]" />
        {f.label}
      </label>
    )
  }

  let control
  if (f.type === 'select' || f.type === 'employee') {
    const options = f.type === 'employee' ? employees.map((e) => ({ value: e._id, label: `${e.firstName} ${e.lastName}` })) : f.options
    control = (
      <select id={id} value={value ?? ''} onChange={(e) => update(f.name, e.target.value)} className={base}>
        <option value="">Select...</option>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o
          const l = typeof o === 'object' ? o.label : o
          return (
            <option key={v} value={v}>
              {l}
            </option>
          )
        })}
      </select>
    )
  } else if (f.type === 'area') {
    control = <textarea id={id} rows={f.rows || 2} value={value ?? ''} placeholder={f.placeholder} onChange={(e) => update(f.name, e.target.value)} className={`${base} resize-none`} />
  } else if (f.type === 'multi') {
    control = (
      <div id={id} className="flex flex-wrap gap-2">
        {f.options.map((o) => {
          const on = (value || []).includes(o)
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => update(f.name, on ? value.filter((x) => x !== o) : [...(value || []), o])}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${ring} ${on ? 'border-[#F41703] bg-[#F41703] text-white' : 'border-gray-300 bg-white text-gray-600 hover:border-[#F41703] hover:text-[#F41703]'}`}
            >
              {o}
            </button>
          )
        })}
      </div>
    )
  } else {
    control = <input id={id} type={f.type === 'tel' ? 'tel' : f.type} value={value ?? ''} placeholder={f.placeholder} onChange={(e) => update(f.name, e.target.value)} className={base} />
  }

  return (
    <div className={wrap}>
      <label htmlFor={id} className="mb-0.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-gray-500">
        <span>
          {f.label} {required && <span className="text-[#F41703]">*</span>}
        </span>
        {f.help === 'sameAsMobile' && form.mobileNumber && (
          <button type="button" onClick={() => update('whatsapp', form.mobileNumber)} className="text-[10px] font-bold normal-case tracking-normal text-[#F41703] hover:underline">
            Same as mobile
          </button>
        )}
      </label>
      {control}
      {error && <p className="mt-0.5 text-[11px] font-medium text-red-600">{error}</p>}
      {!error && f.help && f.help !== 'sameAsMobile' && <p className="mt-0.5 text-[11px] leading-snug text-gray-400">{f.help}</p>}
    </div>
  )
}

/* ================================================================== */
/* Add / edit form (quick add or full details)                         */
/* ================================================================== */
const LeadForm = ({ lead, employees, leads, onClose, onSaved, onOpenLead, notify }) => {
  const editing = !!lead
  const [form, setForm] = useState(() => (lead ? formFromLead(lead) : emptyForm()))
  const [mode, setMode] = useState('full')
  const [tab, setTab] = useState(0)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [dupPrompt, setDupPrompt] = useState(false)
  const [askDiscard, setAskDiscard] = useState(false)
  const initial = useRef(JSON.stringify(form))
  const bodyRef = useRef(null)

  const dirty = JSON.stringify(form) !== initial.current
  const duplicates = useMemo(() => findDuplicates(form, leads, lead?._id), [form.mobileNumber, form.alternatePhone, form.email, leads, lead]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Rules that run as the user fills the form */
  const update = (name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'marketingConsent') next.consentDate = value === 'Yes' ? prev.consentDate || todayStr() : ''
      if (name === 'disqualificationReason' && value) {
        next.qualificationStatus = 'Disqualified'
        next.leadStage = 'Disqualified'
      }
      if (name === 'qualificationStatus' && value !== 'Disqualified') next.disqualificationReason = ''
      if (name === 'status' && value === 'Won' && prev.conversionStatus === 'Not Converted') next.conversionStatus = 'Converted to Customer'
      if (name === 'status' && value === 'Lost') next.conversionStatus = 'Lost'
      return next
    })
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e))
    if (name === 'mobileNumber' || name === 'email') setDupPrompt(false)
  }

  const requestClose = () => (dirty ? setAskDiscard(true) : onClose())

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (askDiscard ? setAskDiscard(false) : requestClose())
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }) // re-bound every render so it always sees the latest state

  const save = async (ignoreDuplicates = false) => {
    const errs = validate(form, mode, editing)
    setErrors(errs)
    const firstBad = ALL_FIELDS.find((f) => errs[f.name])
    if (firstBad) {
      if (mode === 'full') setTab(TABS.findIndex((t) => t.id === firstBad.tab))
      setTimeout(() => document.getElementById(`f-${firstBad.name}`)?.focus(), 60)
      notify('error', 'Please fix the highlighted fields.')
      return
    }
    if (!editing && !ignoreDuplicates && duplicates.length) {
      setDupPrompt(true)
      bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSaving(true)
    try {
      const payload = buildPayload(form)
      if (!editing && duplicates.length) {
        payload.duplicateCheckStatus = 'Possible Duplicate'
        payload.duplicateOf = duplicates[0]._id
      }
      if (editing) await api.put(`/api/crm/leads/${lead._id}`, payload)
      else await api.post('/api/crm/leads', payload)
      onSaved({ editing, becameQualified: editing && form.status === 'Qualified' && lead.status !== 'Qualified', leadId: lead?._id })
    } catch (err) {
      console.error('Failed to save lead:', err)
      notify('error', `Could not save the lead: ${err.response?.data?.message || err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const tabErrors = TABS.map((t) => ALL_FIELDS.filter((f) => f.tab === t.id && errors[f.name]).length)
  const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ')

  const renderSections = (sections) =>
    sections.map((s) => {
      if (s.show && !s.show(form, editing)) return null
      const fields = s.fields.filter((f) => isVisible(f, form) && (mode === 'full' || f.quick))
      if (!fields.length) return null
      return (
        <section key={s.title} className="mb-4 last:mb-0">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 md:grid-cols-3 xl:grid-cols-4">
            {fields.map((f) => (
              <FieldView key={f.name} f={f} form={form} update={update} error={errors[f.name]} employees={employees} />
            ))}
          </div>
        </section>
      )
    })

  return (
    <div className="fixed left-0 top-0 z-50 flex h-[100dvh] w-screen items-center justify-center bg-gray-900/50 p-3 backdrop-blur-md sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && requestClose()}>
      <div role="dialog" aria-modal="true" aria-label={editing ? 'Edit lead' : 'Add lead'} className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{editing ? `Edit lead${lead.leadNumber ? ` ${lead.leadNumber}` : ''}` : mode === 'quick' ? 'Add new lead' : 'Add new lead (full details)'}</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              {editing ? fullName || nameOf(lead) : mode === 'quick' ? 'The essentials only. You can add more details later.' : 'Complete the tabs below. Fields marked * are required.'}
            </p>
          </div>
          <button onClick={requestClose} aria-label="Close" className={`rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 ${ring}`}>
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs (full mode) */}
        {mode === 'full' && (
          <div className="flex overflow-x-auto border-b border-gray-200 px-4" role="tablist">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === i}
                onClick={() => setTab(i)}
                className={`-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${ring} ${
                  tab === i ? 'border-[#F41703] text-[#F41703]' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${tab === i ? 'bg-[#F41703] text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span>
                {t.label}
                {tabErrors[i] > 0 && <span className="rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">{tabErrors[i]}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-4">
          {/* Possible duplicates */}
          {duplicates.length > 0 && (
            <div className={`mb-5 rounded-xl border p-4 ${dupPrompt ? 'border-amber-400 bg-amber-50' : 'border-amber-200 bg-amber-50/60'}`} role="alert">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
                <Icon name="copy" className="h-4 w-4" /> {editing ? 'Another lead has the same mobile number or email' : 'This looks like a lead you already have'}
              </p>
              <ul className="mt-2 space-y-1.5">
                {duplicates.map((d) => (
                  <li key={d._id} className="flex items-center justify-between gap-3 text-sm text-amber-900">
                    <span>
                      <b>{nameOf(d)}</b> {d.leadNumber && <span className="text-amber-700">({d.leadNumber})</span>} · {d.phone || d.mobileNumber || d.email}
                    </span>
                    <button type="button" onClick={() => onOpenLead(d._id)} className="font-semibold text-[#F41703] hover:underline">
                      Open
                    </button>
                  </li>
                ))}
              </ul>
              {dupPrompt && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => save(true)} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
                    Save anyway
                  </button>
                  <span className="text-xs text-amber-800">It will be flagged as a possible duplicate.</span>
                </div>
              )}
            </div>
          )}

          {mode === 'quick' ? (
            <>
              {TABS.map((t) => (
                <React.Fragment key={t.id}>{renderSections(t.sections)}</React.Fragment>
              ))}
            </>
          ) : (
            renderSections(TABS[tab].sections)
          )}

          {mode === 'full' && TABS[tab].id === 'source' && editing && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Lead score (calculated automatically)</p>
              <div className="flex items-center gap-4">
                <ScoreRing score={lead.leadScore ?? 0} size={52} stroke={5} />
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-800">
                    {lead.leadScore ?? 0} / 100 {lead.leadGrade ? `· Grade ${lead.leadGrade}` : ''} {lead.leadRating ? `· ${lead.leadRating}` : ''}
                  </p>
                  <p className="text-xs text-gray-500">The score updates when you save, based on qualification, engagement and sales-readiness fields.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3">
          <div className="flex items-center gap-3">
            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'quick' ? 'full' : 'quick')
                  setTab(0)
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-[#F41703] hover:bg-[#F41703]/10 ${ring}`}
              >
                {mode === 'quick' ? 'Add more details' : 'Back to quick add'}
              </button>
            )}
            {mode === 'full' && (
              <div className="flex gap-1">
                <button type="button" disabled={tab === 0} onClick={() => setTab(tab - 1)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-white disabled:opacity-40">
                  Back
                </button>
                <button type="button" disabled={tab === TABS.length - 1} onClick={() => setTab(tab + 1)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-white disabled:opacity-40">
                  Next
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={requestClose} className={`rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 ${ring}`}>
              Cancel
            </button>
            <button type="button" onClick={() => save(false)} disabled={saving} className={`rounded-lg px-5 py-1.5 text-xs font-bold text-white shadow-md shadow-[#F41703]/25 disabled:opacity-60 ${brandGrad} ${ring}`}>
              {saving ? 'Saving...' : editing ? 'Update lead' : 'Create lead'}
            </button>
          </div>
        </div>

        {/* Discard changes */}
        {askDiscard && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-gray-900/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <h4 className="text-lg font-bold text-gray-900">Discard your changes?</h4>
              <p className="mt-1.5 text-sm text-gray-600">Anything you have typed in this form will be lost.</p>
              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setAskDiscard(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Keep editing
                </button>
                <button onClick={onClose} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ================================================================== */
/* Detail drawer                                                      */
/* ================================================================== */
const InfoGrid = ({ items, hideEmpty }) => {
  const rows = items.filter(([, v]) => !hideEmpty || !(v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)))
  if (!rows.length) return <p className="text-sm text-gray-400">Nothing recorded yet</p>
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{k}</dt>
          <dd className="mt-0.5 break-words text-sm font-medium text-gray-800">{v === undefined || v === null || v === '' ? '—' : v}</dd>
        </div>
      ))}
    </dl>
  )
}

const Card = ({ title, children, className = '' }) => (
  <section className={`rounded-2xl border border-gray-200 bg-white p-5 ${className}`}>
    {title && <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">{title}</h4>}
    {children}
  </section>
)

const LeadDrawer = ({ lead, onClose, onEdit, onDelete, onDeal, onChanged, notify }) => {
  const [tab, setTab] = useState('overview')
  const [activities, setActivities] = useState([])
  const [loadingActs, setLoadingActs] = useState(true)
  const [form, setForm] = useState({ type: 'Call Log', subject: '', description: '', outcome: '', activityDate: '' })
  const [adding, setAdding] = useState(false)
  const [qualifying, setQualifying] = useState(false)
  const subjectRef = useRef(null)

  const loadActivities = useCallback(async () => {
    try {
      const res = await api.get(`/api/crm/leads/${lead._id}/activities`)
      setActivities(res.data.data || [])
    } catch (err) {
      console.error('Failed to fetch activities:', err)
    } finally {
      setLoadingActs(false)
    }
  }, [lead._id])

  useEffect(() => {
    setTab('overview')
    setLoadingActs(true)
    setActivities([])
    loadActivities()
  }, [loadActivities])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const addActivity = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await api.post(`/api/crm/leads/${lead._id}/activities`, {
        type: form.type,
        subject: form.subject,
        description: form.description,
        outcome: form.outcome,
        activityDate: form.activityDate || undefined
      })
      await loadActivities()
      setForm({ type: 'Call Log', subject: '', description: '', outcome: '', activityDate: '' })
      notify('success', 'Activity logged.')
      onChanged() // refresh counters and score
    } catch (err) {
      notify('error', `Could not log the activity: ${err.response?.data?.message || err.message}`)
    } finally {
      setAdding(false)
    }
  }

  const deleteActivity = async (id) => {
    try {
      await api.delete(`/api/crm/leads/${lead._id}/activities/${id}`)
      setActivities((prev) => prev.filter((a) => a._id !== id))
    } catch (err) {
      notify('error', 'Could not delete the activity.')
    }
  }

  const markQualified = async () => {
    setQualifying(true)
    try {
      await api.put(`/api/crm/leads/${lead._id}`, { status: 'Qualified', qualificationStatus: 'Qualified', leadStage: 'Qualified' })
      notify('success', 'Lead marked as Qualified. You can now create a deal.')
      onChanged()
    } catch (err) {
      notify('error', `Could not update the lead: ${err.response?.data?.message || err.message}`)
    } finally {
      setQualifying(false)
    }
  }

  const due = dueInfo(lead)
  const band = scoreBand(lead.leadScore ?? 0)
  const mobile = lead.mobileNumber || lead.phone
  const timelineNear = NEAR_TIMELINES.includes(lead.purchaseTimeline)
  const meetsRule = lead.budgetAvailable === 'Confirmed' && lead.decisionMakerConfirmed === 'Yes' && timelineNear && lead.status !== 'Qualified' && !isClosed(lead)

  const checklist = [
    ['Need', lead.requirementIdentified === 'Yes' ? 'ok' : lead.requirementIdentified === 'Partially' ? 'part' : 'no', lead.requirementIdentified || 'Not recorded'],
    ['Budget', lead.budgetAvailable === 'Confirmed' ? 'ok' : lead.budgetAvailable === 'Likely' ? 'part' : 'no', lead.budgetAvailable || 'Not recorded'],
    ['Authority', lead.decisionMakerConfirmed === 'Yes' || lead.purchaseAuthority === 'Decision Maker' ? 'ok' : lead.purchaseAuthority === 'Influencer' ? 'part' : 'no', lead.purchaseAuthority || (lead.decisionMakerConfirmed === 'Yes' ? 'Decision-maker confirmed' : 'Not recorded')],
    ['Timeline', timelineNear ? 'ok' : lead.purchaseTimeline === '3–6 Months' ? 'part' : 'no', lead.purchaseTimeline || 'Not recorded']
  ]

  const link = (href, text) =>
    text ? (
      <a href={href} className="text-[#F41703] hover:underline" target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {text}
      </a>
    ) : (
      ''
    )

  const actionBtn = 'inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors'

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside role="dialog" aria-modal="true" aria-label="Lead details" className="flex h-full w-full max-w-2xl flex-col bg-gray-50 shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar name={nameOf(lead)} size="h-14 w-14 text-lg" />
              <div className="min-w-0">
                <h3 className="truncate text-xl font-bold text-gray-900">{nameOf(lead)}</h3>
                <p className="truncate text-sm text-gray-500">
                  {lead.leadNumber && <span className="font-semibold text-gray-700">{lead.leadNumber}</span>}
                  {lead.leadNumber && lead.companyName ? ' · ' : ''}
                  {lead.companyName}
                  {lead.jobTitle ? ` · ${lead.jobTitle}` : ''}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Pill cls={STATUS_COLORS[lead.status] || TONE.gray}>{lead.status}</Pill>
                  {lead.leadRating && <Pill cls={RATING_COLORS[lead.leadRating] || TONE.gray}>{lead.leadRating}</Pill>}
                  {lead.leadGrade && <Pill cls={GRADE_COLORS[lead.leadGrade] || TONE.gray}>Grade {lead.leadGrade}</Pill>}
                  {due?.overdue && <Pill cls={TONE.red}>{due.label}</Pill>}
                </div>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close" className={`rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 ${ring}`}>
              <Icon name="x" className="h-5 w-5" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {mobile && !lead.doNotCall && (
              <a href={`tel:${digits(mobile) ? `+${waNumber(mobile)}` : mobile}`} className={`${actionBtn} bg-green-50 text-green-700 hover:bg-green-100`}>
                <Icon name="phone" /> Call
              </a>
            )}
            {(lead.whatsapp || mobile) && !lead.doNotWhatsApp && (
              <a href={`https://wa.me/${waNumber(lead.whatsapp || mobile)}`} target="_blank" rel="noopener noreferrer" className={`${actionBtn} bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}>
                <Icon name="message" /> WhatsApp
              </a>
            )}
            {lead.email && (
              <a href={`mailto:${lead.email}`} className={`${actionBtn} bg-blue-50 text-blue-700 hover:bg-blue-100`}>
                <Icon name="mail" /> Email
              </a>
            )}
            <button onClick={() => onEdit(lead)} className={`${actionBtn} bg-gray-100 text-gray-700 hover:bg-gray-200 ${ring}`}>
              <Icon name="pencil" /> Edit
            </button>
            {lead.status === 'Qualified' && (
              <button onClick={() => onDeal(lead)} className={`${actionBtn} text-white ${brandGrad} shadow-md shadow-[#F41703]/25 ${ring}`}>
                <Icon name="briefcase" /> Create deal
              </button>
            )}
          </div>
          {(lead.doNotCall || lead.doNotWhatsApp) && (
            <p className="mt-3 text-xs font-semibold text-red-600">
              {[lead.doNotCall && 'Do not call', lead.doNotWhatsApp && 'Do not WhatsApp'].filter(Boolean).join(' · ')} is set for this lead.
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 bg-white px-4" role="tablist">
          {[
            ['overview', 'Overview'],
            ['qualification', 'Qualification'],
            ['activity', `Activity${activities.length ? ` (${activities.length})` : ''}`]
          ].map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${ring} ${tab === id ? 'border-[#F41703] text-[#F41703]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {tab === 'overview' && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Card title="Next step">
                  {isClosed(lead) ? (
                    <p className="text-sm text-gray-500">This lead is closed, so no follow-up is scheduled.</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Pill cls={TONE[due.tone]}>{due.label}</Pill>
                        {lead.followUpDate && <span className="text-sm font-medium text-gray-700">{fmtDate(lead.followUpDate)}</span>}
                      </div>
                      <p className="text-sm text-gray-700">
                        <span className="text-gray-400">Action:</span> <b>{lead.nextAction || 'Not set'}</b>
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="text-gray-400">Owner:</span> <b>{ownerName(lead)}</b>
                      </p>
                    </div>
                  )}
                </Card>

                <Card title="Lead score">
                  <div className="flex items-center gap-4">
                    <ScoreRing score={lead.leadScore ?? 0} size={64} stroke={6} />
                    <div>
                      <p className="font-bold text-gray-900" style={{ color: band.color }}>
                        {band.label}
                      </p>
                      <p className="text-xs leading-relaxed text-gray-500">{band.text}</p>
                    </div>
                  </div>
                  {lead.scoreBreakdown && (
                    <div className="mt-4 space-y-2">
                      {[
                        ['Fit', lead.scoreBreakdown.fit, 40],
                        ['Engagement', lead.scoreBreakdown.engagement, 30],
                        ['Sales-readiness', lead.scoreBreakdown.salesReadiness, 30]
                      ].map(([label, val, max]) => (
                        <div key={label}>
                          <div className="mb-0.5 flex justify-between text-xs text-gray-500">
                            <span>{label}</span>
                            <span className="font-semibold text-gray-700">
                              {val ?? 0}/{max}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#F41703] to-[#F97316]" style={{ width: `${Math.min(100, ((val || 0) / max) * 100)}%` }} />
                          </div>
                        </div>
                      ))}
                      {!!lead.scoreBreakdown.negative && <p className="text-xs font-semibold text-red-600">Deductions: {lead.scoreBreakdown.negative}</p>}
                    </div>
                  )}
                </Card>
              </div>

              <Card title="Contact">
                <InfoGrid
                  items={[
                    ['Mobile', link(`tel:+${waNumber(mobile)}`, mobile)],
                    ['Alternate phone', lead.alternatePhone],
                    ['WhatsApp', lead.whatsapp],
                    ['Email', link(`mailto:${lead.email}`, lead.email)],
                    ['Alternate email', lead.alternateEmail],
                    ['Preferred contact', lead.preferredContactMethod],
                    ['Language', lead.preferredLanguage],
                    ['Best time to contact', lead.bestTimeToContact],
                    ['Marketing consent', lead.marketingConsent ? `${lead.marketingConsent}${lead.consentDate ? ` (${fmtDate(lead.consentDate)})` : ''}` : '']
                  ]}
                  hideEmpty
                />
              </Card>

              <Card title="Company and location">
                <InfoGrid
                  items={[
                    ['Company', lead.companyName],
                    ['Job title', lead.jobTitle],
                    ['Department', lead.department],
                    ['Industry', lead.industry],
                    ['Company type', lead.companyType],
                    ['Size', lead.companySize],
                    ['Annual revenue', lead.annualRevenue],
                    ['Website', lead.website],
                    ['Address', lead.address],
                    ['Location', [lead.city, lead.state, lead.country].filter(Boolean).join(', ')],
                    ['PIN / ZIP', lead.pincode]
                  ]}
                  hideEmpty
                />
              </Card>

              <Card title="Requirement">
                <InfoGrid
                  items={[
                    ['Product / service interest', lead.productInterest],
                    ['Category', lead.productCategory],
                    ['Requirement', lead.productRequirement],
                    ['Quantity', lead.quantity ? `${lead.quantity}${lead.quantityUnit ? ` ${lead.quantityUnit}` : ''}` : ''],
                    ['Target price / budget', lead.targetPrice],
                    ['Budget range', lead.budgetRange],
                    ['Required delivery', lead.requiredDeliveryDate ? fmtDate(lead.requiredDeliveryDate) : ''],
                    ['Destination country', lead.destinationCountry],
                    ['Delivery / site location', lead.siteLocation],
                    ['Shipping terms', lead.shippingTerms],
                    ['Project', lead.projectName],
                    ['Documents required', lead.documentsRequired],
                    ['Samples required', lead.samplesRequired],
                    ['Site visit required', lead.siteVisitRequired],
                    ['Specifications', lead.productSpecifications]
                  ]}
                  hideEmpty
                />
                {Array.isArray(lead.servicesInterested) && lead.servicesInterested.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">Sourcing services needed</p>
                    <div className="flex flex-wrap gap-2">
                      {lead.servicesInterested.map((s) => (
                        <span key={s} className="rounded-full bg-[#F41703]/10 px-3 py-1 text-xs font-semibold text-[#F41703]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <Card title="Source and ownership">
                <InfoGrid
                  items={[
                    ['Source', lead.source],
                    ['Sub source', lead.subSource],
                    ['Campaign', lead.campaignName],
                    ['UTM source / medium', [lead.utmSource, lead.utmMedium].filter(Boolean).join(' / ')],
                    ['UTM campaign', lead.utmCampaign],
                    ['Referral', [lead.referralName, lead.referralContact].filter(Boolean).join(' · ')],
                    ['Captured by', lead.leadCapturedBy],
                    ['Owner', ownerName(lead)],
                    ['Team', lead.assignedTeam],
                    ['Region', lead.assignedRegion],
                    ['First response', lead.firstResponseDate ? `${fmtDate(lead.firstResponseDate)}${lead.firstResponseMode ? ` (${lead.firstResponseMode})` : ''}` : ''],
                    ['Last contact', lead.lastContactDate ? `${fmtDate(lead.lastContactDate)}${lead.lastContactMethod ? ` (${lead.lastContactMethod})` : ''}` : ''],
                    ['Follow-ups', lead.numberOfFollowUps ?? 0],
                    ['Communication', lead.communicationStatus],
                    ['Created', lead.createdAt ? fmtDate(lead.createdAt) : '']
                  ]}
                  hideEmpty
                />
              </Card>

              {lead.notes && (
                <Card title="Remarks">
                  <p className="whitespace-pre-wrap text-sm text-gray-700">{lead.notes}</p>
                </Card>
              )}

              <button onClick={() => onDelete(lead)} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 ${ring}`}>
                <Icon name="trash" /> Delete this lead
              </button>
            </>
          )}

          {tab === 'qualification' && (
            <>
              <Card title="Qualification checklist">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <Pill cls={lead.qualificationStatus === 'Qualified' ? TONE.green : lead.qualificationStatus === 'Disqualified' ? TONE.red : TONE.gray}>{lead.qualificationStatus || 'Pending'}</Pill>
                  {lead.qualificationFramework && <span className="text-xs font-semibold text-gray-500">Framework: {lead.qualificationFramework}</span>}
                </div>
                <ul className="grid grid-cols-2 gap-3">
                  {checklist.map(([label, state, text]) => (
                    <li key={label} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white ${state === 'ok' ? 'bg-green-500' : state === 'part' ? 'bg-amber-400' : 'bg-gray-300'}`}>
                        <Icon name={state === 'no' ? 'x' : 'check'} className="h-4 w-4" sw={3} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">{label}</span>
                        <span className="block truncate text-sm font-semibold text-gray-800">{text}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                {meetsRule && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-800">Budget confirmed, decision-maker confirmed and timeline within 3 months. This lead meets the qualification rule.</p>
                    <button onClick={markQualified} disabled={qualifying} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
                      {qualifying ? 'Updating...' : 'Mark as Qualified'}
                    </button>
                  </div>
                )}
              </Card>

              <Card title="Decision maker">
                <InfoGrid
                  items={[
                    ['Name', lead.decisionMakerName],
                    ['Designation', lead.decisionMakerDesignation],
                    ['Contact', lead.decisionMakerContact],
                    ['Role', lead.decisionRole],
                    ['Number of decision-makers', lead.numberOfDecisionMakers],
                    ['Decision-maker confirmed', lead.decisionMakerConfirmed]
                  ]}
                  hideEmpty
                />
              </Card>

              <Card title="Commercials">
                <InfoGrid
                  items={[
                    ['Expected order value', fmtMoney(lead.expectedOrderValue, lead.expectedOrderCurrency) === '—' ? '' : fmtMoney(lead.expectedOrderValue, lead.expectedOrderCurrency)],
                    ['Expected closing', lead.expectedClosingDate ? fmtDate(lead.expectedClosingDate) : ''],
                    ['Probability of closure', lead.probabilityOfClosure ? `${lead.probabilityOfClosure}%` : ''],
                    ['Urgency', lead.urgencyLevel],
                    ['Product fit', lead.productFit],
                    ['Payment terms', lead.paymentTerms],
                    ['Credit requirement', lead.creditRequirement],
                    ['Deal value', fmtMoney(lead.dealValue, lead.expectedOrderCurrency) === '—' ? '' : fmtMoney(lead.dealValue, lead.expectedOrderCurrency)],
                    ['Revenue booked', fmtMoney(lead.revenueBooked, lead.expectedOrderCurrency) === '—' ? '' : fmtMoney(lead.revenueBooked, lead.expectedOrderCurrency)]
                  ]}
                  hideEmpty
                />
              </Card>

              <Card title="Context and competition">
                <InfoGrid
                  items={[
                    ['Pain point', lead.painPoint],
                    ['Current supplier', lead.currentSupplier],
                    ['Supplier satisfaction', lead.supplierSatisfaction],
                    ['Competitor quoted', lead.competitorQuoted],
                    ['Competitor price', lead.competitorPrice],
                    ['Qualification remarks', lead.qualificationRemarks]
                  ]}
                  hideEmpty
                />
              </Card>

              {(lead.disqualificationReason || lead.wonLostReason || (lead.conversionStatus && lead.conversionStatus !== 'Not Converted')) && (
                <Card title="Outcome">
                  <InfoGrid
                    items={[
                      ['Disqualification reason', lead.disqualificationReason],
                      ['Won / lost reason', lead.wonLostReason],
                      ['Lost to', lead.lostCompetitor],
                      ['Conversion status', lead.conversionStatus],
                      ['Actual closing', lead.actualClosingDate ? fmtDate(lead.actualClosingDate) : '']
                    ]}
                    hideEmpty
                  />
                </Card>
              )}
            </>
          )}

          {tab === 'activity' && (
            <>
              <Card title="Log an activity">
                <div className="mb-3 flex flex-wrap gap-2">
                  {QUICK_LOG.map(([type, label]) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, type }))
                        subjectRef.current?.focus()
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${form.type === type ? 'border-[#F41703] bg-[#F41703] text-white' : 'border-gray-300 text-gray-600 hover:border-[#F41703] hover:text-[#F41703]'}`}
                    >
                      <Icon name={ACTIVITY_ICON[type]} className="h-3.5 w-3.5" /> {label}
                    </button>
                  ))}
                </div>
                <form onSubmit={addActivity} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#F41703] focus:ring-2 focus:ring-[#F41703]/15">
                      {ACTIVITY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <input type="datetime-local" value={form.activityDate} onChange={(e) => setForm({ ...form, activityDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#F41703] focus:ring-2 focus:ring-[#F41703]/15" />
                  </div>
                  <input ref={subjectRef} type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#F41703] focus:ring-2 focus:ring-[#F41703]/15" />
                  <textarea rows={2} placeholder="Description / notes" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#F41703] focus:ring-2 focus:ring-[#F41703]/15" />
                  <input type="text" placeholder="Outcome (optional)" value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#F41703] focus:ring-2 focus:ring-[#F41703]/15" />
                  <button type="submit" disabled={adding} className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${brandGrad} ${ring}`}>
                    {adding ? 'Adding...' : 'Log activity'}
                  </button>
                </form>
              </Card>

              <Card title="Timeline">
                {loadingActs ? (
                  <p className="py-6 text-center text-sm text-gray-500">Loading activities...</p>
                ) : activities.length === 0 ? (
                  <div className="py-8 text-center">
                    <span className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <Icon name="inbox" className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-semibold text-gray-600">No activities yet</p>
                    <p className="text-xs text-gray-400">Log your first call, message or meeting above.</p>
                  </div>
                ) : (
                  <ol className="relative ml-4 space-y-5 border-l-2 border-gray-200">
                    {activities.map((a) => (
                      <li key={a._id} className="ml-6">
                        <span className="absolute -left-[17px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#F41703] to-[#F97316] text-white shadow">
                          <Icon name={ACTIVITY_ICON[a.type] || 'note'} className="h-3.5 w-3.5" />
                        </span>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900">{a.subject || a.type}</p>
                            <p className="text-xs text-gray-400">
                              {a.type} · {fmtDateTime(a.activityDate)}
                              {a.createdBy ? ` · ${`${a.createdBy.firstName || ''} ${a.createdBy.lastName || ''}`.trim()}` : ''}
                            </p>
                            {a.description && <p className="mt-1 text-sm text-gray-600">{a.description}</p>}
                            {a.outcome && <p className="mt-1 text-sm font-medium text-green-700">Outcome: {a.outcome}</p>}
                          </div>
                          <button onClick={() => deleteActivity(a._id)} className="flex-shrink-0 rounded p-1 text-gray-300 hover:text-red-500" title="Delete activity" aria-label="Delete activity">
                            <Icon name="x" className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </Card>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}

/* ================================================================== */
/* Page                                                               */
/* ================================================================== */
const QUICK_VIEWS = [
  { id: 'all', label: 'All leads', icon: 'users', color: '#F41703', test: () => true },
  { id: 'hot', label: 'Hot leads', icon: 'flame', color: '#DC2626', test: (l) => !isClosed(l) && ((l.leadScore ?? 0) >= 80 || l.leadRating === 'Hot') },
  { id: 'today', label: 'Due today', icon: 'clock', color: '#D97706', test: (l) => !isClosed(l) && followDiff(l) === 0 },
  { id: 'overdue', label: 'Overdue', icon: 'alert', color: '#B91C1C', test: (l) => !isClosed(l) && followDiff(l) !== null && followDiff(l) < 0 },
  { id: 'unassigned', label: 'Unassigned', icon: 'userPlus', color: '#2563EB', test: (l) => !isClosed(l) && !l.assignedTo },
  { id: 'qualified', label: 'Qualified', icon: 'check', color: '#059669', test: (l) => l.status === 'Qualified' || l.qualificationStatus === 'Qualified' }
]

const SORTS = {
  newest: { label: 'Newest first', fn: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) },
  score: { label: 'Highest score', fn: (a, b) => (b.leadScore ?? 0) - (a.leadScore ?? 0) },
  followup: {
    label: 'Follow-up soonest',
    fn: (a, b) => (a.followUpDate ? new Date(a.followUpDate) : Infinity) - (b.followUpDate ? new Date(b.followUpDate) : Infinity)
  },
  name: { label: 'Name A to Z', fn: (a, b) => nameOf(a).localeCompare(nameOf(b)) }
}

const Leads = () => {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('')
  const [quickView, setQuickView] = useState('all')
  const [sortKey, setSortKey] = useState('newest')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formState, setFormState] = useState(null) // { lead }
  const [viewId, setViewId] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [toasts, setToasts] = useState([])

  const notify = useCallback((type, message) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500)
  }, [])

  const fetchLeads = useCallback(async () => {
    try {
      const response = await api.get('/api/crm/leads')
      setLeads(response.data.data || [])
      setLoadError('')
    } catch (err) {
      console.error('Failed to fetch leads:', err)
      setLoadError(err.response?.data?.message || err.message || 'Could not load leads')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await api.get('/api/crm/employees?forAssignment=true')
      setEmployees(response.data.data || [])
    } catch (err) {
      console.error('Failed to fetch employees:', err)
    }
  }, [])

  useEffect(() => {
    fetchLeads()
    fetchEmployees()
  }, [fetchLeads, fetchEmployees])

  useEffect(() => setPage(1), [search, statusFilter, ratingFilter, sourceFilter, ownerFilter, quickView, sortKey, pageSize])

  /* ---------- derived data ---------- */
  const viewLead = useMemo(() => leads.find((l) => l._id === viewId) || null, [leads, viewId])

  const counts = useMemo(() => Object.fromEntries(QUICK_VIEWS.map((v) => [v.id, leads.filter(v.test).length])), [leads])
  const statusCounts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, leads.filter((l) => l.status === s).length])), [leads])
  const conversion = useMemo(() => {
    const won = leads.filter((l) => l.status === 'Won' || String(l.conversionStatus || '').startsWith('Converted')).length
    return leads.length ? Math.round((won / leads.length) * 100) : 0
  }, [leads])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const view = QUICK_VIEWS.find((v) => v.id === quickView) || QUICK_VIEWS[0]
    const list = leads.filter((l) => {
      if (!view.test(l)) return false
      if (statusFilter && l.status !== statusFilter) return false
      if (ratingFilter && l.leadRating !== ratingFilter) return false
      if (sourceFilter && l.source !== sourceFilter) return false
      if (ownerFilter === 'none' ? l.assignedTo : ownerFilter && (l.assignedTo?._id || l.assignedTo) !== ownerFilter) return false
      if (!q) return true
      return [l.leadNumber, l.customerName, l.firstName, l.lastName, l.companyName, l.email, l.phone, l.mobileNumber, l.productRequirement, l.productInterest, l.city, l.state, l.country]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
    return [...list].sort(SORTS[sortKey].fn)
  }, [leads, search, statusFilter, ratingFilter, sourceFilter, ownerFilter, quickView, sortKey])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)
  const anyFilter = search || statusFilter || ratingFilter || sourceFilter || ownerFilter || quickView !== 'all'
  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setRatingFilter('')
    setSourceFilter('')
    setOwnerFilter('')
    setQuickView('all')
  }

  /* ---------- actions ---------- */
  const handleSaved = async ({ editing, becameQualified, leadId }) => {
    setFormState(null)
    await fetchLeads()
    notify('success', editing ? 'Lead updated.' : 'Lead created.')
    if (becameQualified) navigate(`/crm/deals?leadId=${leadId}`)
  }

  const askDelete = (lead) =>
    setConfirm({
      title: 'Delete this lead?',
      message: `${nameOf(lead)}${lead.leadNumber ? ` (${lead.leadNumber})` : ''} and its activity history will be permanently removed.`,
      confirmLabel: 'Delete lead',
      danger: true,
      onConfirm: async () => {
        setConfirm(null)
        try {
          await api.delete(`/api/crm/leads/${lead._id}`)
          if (viewId === lead._id) setViewId(null)
          await fetchLeads()
          notify('success', 'Lead deleted.')
        } catch (err) {
          notify('error', `Could not delete the lead: ${err.response?.data?.message || err.message}`)
        }
      }
    })

  const exportCsv = () => {
    const head = ['Lead ID', 'Name', 'Company', 'Mobile', 'Email', 'City', 'State', 'Country', 'Source', 'Status', 'Stage', 'Rating', 'Score', 'Grade', 'Owner', 'Next follow-up', 'Next action', 'Requirement', 'Created']
    const rows = filtered.map((l) => [
      l.leadNumber, nameOf(l), l.companyName, l.mobileNumber || l.phone, l.email, l.city, l.state, l.country, l.source, l.status, l.leadStage, l.leadRating,
      l.leadScore ?? 0, l.leadGrade, ownerName(l), l.followUpDate ? toDateInput(l.followUpDate) : '', l.nextAction, l.productRequirement, l.createdAt ? toDateInput(l.createdAt) : ''
    ])
    const csv = [head, ...rows].map((r) => r.map(csvCell).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${todayStr()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    notify('success', `Exported ${filtered.length} lead${filtered.length === 1 ? '' : 's'}.`)
  }

  const selectCls = 'rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#F41703]'

  return (
    <div className="space-y-6">
      {/* CRM sub-navigation */}
      <nav aria-label="CRM sections" className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        {[
          ['/crm', 'Dashboard'],
          ['/crm/leads', 'Leads'],
          ['/crm/customers', 'Customers'],
          ['/crm/followups', 'Follow-ups'],
          ['/crm/deals', 'Deals'],
          ['/crm/quotations', 'Quotations']
        ].map(([to, label]) => (
          <Link
            key={to}
            to={to}
            aria-current={to === '/crm/leads' ? 'page' : undefined}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${ring} ${to === '/crm/leads' ? `${brandGrad} text-white shadow-md shadow-[#F41703]/25` : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Lead Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            {leads.length} total leads · {conversion}% converted
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => { setLoading(true); fetchLeads() }} aria-label="Refresh" title="Refresh" className={`rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm hover:text-[#F41703] ${ring}`}>
            <Icon name="refresh" className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={exportCsv} disabled={!filtered.length} className={`inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-[#F41703] hover:text-[#F41703] disabled:opacity-50 ${ring}`}>
            <Icon name="download" /> Export CSV
          </button>
          <button onClick={() => setFormState({ lead: null })} className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#F41703]/25 transition-shadow hover:shadow-lg ${brandGrad} ${ring}`}>
            <Icon name="plus" /> Add New Lead
          </button>
        </div>
      </div>

      {/* Quick views */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {QUICK_VIEWS.map((v) => {
          const on = quickView === v.id
          return (
            <button
              key={v.id}
              onClick={() => setQuickView(v.id)}
              aria-pressed={on}
              className={`group relative overflow-hidden rounded-2xl border bg-white p-4 text-left transition-all duration-300 ${ring} ${on ? 'shadow-lg' : 'border-gray-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md'}`}
              style={on ? { borderColor: v.color, boxShadow: `0 12px 26px -12px ${v.color}77` } : undefined}
            >
              <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 transition-opacity group-hover:opacity-20" style={{ background: v.color }} aria-hidden="true" />
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: v.color }}>
                <Icon name={v.icon} className="h-5 w-5" />
              </span>
              <span className="relative mt-3 block text-2xl font-extrabold tracking-tight text-gray-900">{loading ? '–' : counts[v.id]}</span>
              <span className="relative block text-xs font-semibold text-gray-500">{v.label}</span>
            </button>
          )
        })}
      </div>

    
      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon name="search" />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lead ID, name, company, phone, product, city..."
            aria-label="Search leads"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#F41703]"
          />
        </div>
        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className={selectCls} aria-label="Filter by rating">
          <option value="">All ratings</option>
          {RATINGS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={selectCls} aria-label="Filter by source">
          <option value="">All sources</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className={selectCls} aria-label="Filter by owner">
          <option value="">All owners</option>
          <option value="none">Unassigned</option>
          {employees.map((e) => (
            <option key={e._id} value={e._id}>
              {e.firstName} {e.lastName}
            </option>
          ))}
        </select>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} className={selectCls} aria-label="Sort leads">
          {Object.entries(SORTS).map(([k, s]) => (
            <option key={k} value={k}>
              {s.label}
            </option>
          ))}
        </select>
        {anyFilter && (
          <button onClick={clearFilters} className={`rounded-xl px-3 py-2.5 text-sm font-semibold text-[#F41703] hover:bg-[#F41703]/10 ${ring}`}>
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loadError ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Icon name="alert" className="h-6 w-6" />
            </span>
            <p className="font-semibold text-gray-900">Could not load leads</p>
            <p className="mt-1 text-sm text-gray-500">{loadError}</p>
            <button onClick={() => { setLoading(true); fetchLeads() }} className={`mt-4 rounded-lg bg-[#F41703] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d31402] ${ring}`}>
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-gray-50/80">
                  <tr>
                    {['Lead', 'Contact', 'Requirement', 'Location', 'Source', 'Score', 'Status', 'Owner', 'Next follow-up', ''].map((h) => (
                      <th key={h || 'actions'} scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading &&
                    leads.length === 0 &&
                    [...Array(6)].map((_, r) => (
                      <tr key={r} className="animate-pulse">
                        {[...Array(10)].map((__, c) => (
                          <td key={c} className="px-4 py-4">
                            <div className="h-4 rounded bg-gray-200" style={{ width: `${55 + ((r + c) % 3) * 15}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))}

                  {paged.map((lead) => {
                    const due = dueInfo(lead)
                    const mobile = lead.mobileNumber || lead.phone
                    return (
                      <tr key={lead._id} tabIndex={0} onClick={() => setViewId(lead._id)} onKeyDown={(e) => e.key === 'Enter' && setViewId(lead._id)} className="group cursor-pointer transition-colors hover:bg-[#FFF7F4] focus:bg-[#FFF7F4] focus:outline-none">
                        <td className="whitespace-nowrap px-4 py-3" style={due?.overdue ? { boxShadow: 'inset 3px 0 0 #F41703' } : undefined}>
                          <div className="flex items-center gap-3">
                            <Avatar name={nameOf(lead)} />
                            <div>
                              <p className="text-sm font-bold text-gray-900">{nameOf(lead)}</p>
                              <p className="text-xs text-gray-500">
                                <span className="font-semibold text-gray-600">{lead.leadNumber || '—'}</span>
                                {lead.companyName ? ` · ${lead.companyName}` : ''}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-sm text-gray-800">{mobile || '—'}</p>
                          <p className="text-xs text-gray-500">{lead.email || '—'}</p>
                        </td>
                        <td className="max-w-[220px] px-4 py-3">
                          <p className="truncate text-sm text-gray-800" title={lead.productRequirement}>
                            {lead.productRequirement || lead.productInterest || '—'}
                          </p>
                          {lead.quantity && <p className="text-xs text-gray-500">{lead.quantity} {lead.quantityUnit || ''}</p>}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{[lead.city, lead.country].filter(Boolean).join(', ') || '—'}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{lead.source || '—'}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ScoreRing score={lead.leadScore ?? 0} />
                            {lead.leadGrade && <Pill cls={GRADE_COLORS[lead.leadGrade] || TONE.gray}>{lead.leadGrade}</Pill>}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex flex-col items-start gap-1">
                            <Pill cls={STATUS_COLORS[lead.status] || TONE.gray}>{lead.status}</Pill>
                            {lead.leadRating && <Pill cls={RATING_COLORS[lead.leadRating] || TONE.gray}>{lead.leadRating}</Pill>}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                          {lead.assignedTo ? (
                            <span className="flex items-center gap-2">
                              <Avatar name={ownerName(lead)} size="h-7 w-7 text-[10px]" />
                              {ownerName(lead)}
                            </span>
                          ) : (
                            <span className="text-gray-400">Unassigned</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          {due ? (
                            <>
                              <Pill cls={TONE[due.tone]}>{due.label}</Pill>
                              <p className="mt-1 text-xs text-gray-500">
                                {lead.followUpDate ? fmtDate(lead.followUpDate) : ''} {lead.nextAction ? `· ${lead.nextAction}` : ''}
                              </p>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">Closed</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            {lead.status === 'Qualified' && (
                              <button onClick={() => navigate(`/crm/deals?leadId=${lead._id}`)} title="Create deal" aria-label="Create deal" className={`rounded-lg p-2 text-green-600 hover:bg-green-50 ${ring}`}>
                                <Icon name="briefcase" />
                              </button>
                            )}
                            <button onClick={() => setViewId(lead._id)} title="View" aria-label="View lead" className={`rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 ${ring}`}>
                              <Icon name="eye" />
                            </button>
                            <button onClick={() => setFormState({ lead })} title="Edit" aria-label="Edit lead" className={`rounded-lg p-2 text-blue-600 hover:bg-blue-50 ${ring}`}>
                              <Icon name="pencil" />
                            </button>
                            <button onClick={() => askDelete(lead)} title="Delete" aria-label="Delete lead" className={`rounded-lg p-2 text-red-500 hover:bg-red-50 ${ring}`}>
                              <Icon name="trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {!loading && filtered.length === 0 && (
              <div className="px-6 py-16 text-center">
                <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <Icon name="inbox" className="h-7 w-7" />
                </span>
                <p className="font-semibold text-gray-800">{leads.length === 0 ? 'No leads yet' : 'No leads match these filters'}</p>
                <p className="mt-1 text-sm text-gray-500">{leads.length === 0 ? 'Add your first lead to start tracking your pipeline.' : 'Try a different filter or clear the search.'}</p>
                {leads.length === 0 ? (
                  <button onClick={() => setFormState({ lead: null })} className={`mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white ${brandGrad} ${ring}`}>
                    Add New Lead
                  </button>
                ) : (
                  anyFilter && (
                    <button onClick={clearFilters} className={`mt-5 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 ${ring}`}>
                      Clear filters
                    </button>
                  )
                )}
              </div>
            )}

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-4 py-3 text-sm text-gray-600">
                <span>
                  Showing <b className="text-gray-900">{(page - 1) * pageSize + 1}</b> to <b className="text-gray-900">{Math.min(page * pageSize, filtered.length)}</b> of <b className="text-gray-900">{filtered.length}</b>
                </span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <span className="hidden sm:inline">Rows</span>
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm">
                      {[10, 25, 50].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex items-center gap-2">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)} className={`rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-semibold hover:border-[#F41703] disabled:opacity-40 ${ring}`}>
                      Prev
                    </button>
                    <span className="px-1 font-semibold text-gray-700">
                      {page} / {totalPages}
                    </span>
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className={`rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-semibold hover:border-[#F41703] disabled:opacity-40 ${ring}`}>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add / edit */}
      {formState && (
        <LeadForm
          key={formState.lead?._id || 'new'}
          lead={formState.lead}
          employees={employees}
          leads={leads}
          notify={notify}
          onClose={() => setFormState(null)}
          onSaved={handleSaved}
          onOpenLead={(id) => {
            setFormState(null)
            setViewId(id)
          }}
        />
      )}

      {/* Details */}
      {viewLead && (
        <LeadDrawer
          key={viewLead._id}
          lead={viewLead}
          notify={notify}
          onClose={() => setViewId(null)}
          onEdit={(l) => setFormState({ lead: l })}
          onDelete={askDelete}
          onDeal={(l) => navigate(`/crm/deals?leadId=${l._id}`)}
          onChanged={fetchLeads}
        />
      )}

      <ConfirmDialog dialog={confirm} onCancel={() => setConfirm(null)} />
      <Toasts items={toasts} dismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  )
}

export default Leads