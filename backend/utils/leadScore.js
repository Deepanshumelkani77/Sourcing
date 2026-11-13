/*
 * Lead scoring engine (0-100).
 *
 * Fit            max 40
 * Engagement     max 30
 * Sales-readiness max 30
 * Negative       deductions
 *
 * Classification:
 *   80-100  Hot  / Grade A / P1 - immediate follow-up
 *   60-79   Warm / Grade B / P2 - follow up within 24h
 *   40-59   Moderate / Grade C / P3 - nurture
 *   20-39   Low  / Grade D / P4 - periodic follow-up
 *   <20     Very Low - disqualify or nurture
 */

const has = (v) => v !== undefined && v !== null && String(v).trim() !== "";

const calculateLeadScore = (lead) => {
  let fit = 0;
  let engagement = 0;
  let salesReadiness = 0;
  let negative = 0;

  /* ---- Fit (40) ---- */
  fit += { High: 20, Medium: 12, Low: 5 }[lead.productFit] || 0;
  fit += { Confirmed: 10, Likely: 7, Unknown: 3, "Not Available": 0 }[lead.budgetAvailable] || 0;
  if (has(lead.requirementDetails)) fit += 5;
  if (has(lead.quantity)) fit += 5;

  /* ---- Engagement (30) ---- */
  if (has(lead.email) || has(lead.alternateEmail)) engagement += 5;
  engagement += { Yes: 10, No: 3 }[lead.decisionMakerConfirmed] || 0;
  engagement += {
    "Decision Maker": 10,
    Influencer: 6,
    Recommender: 4,
    "End User": 2,
    Unknown: 0,
  }[lead.purchaseAuthority] || 0;
  if (lead.lastContactDate || (lead.numberOfFollowUps || 0) > 0) engagement += 5;

  /* ---- Sales readiness (30) ---- */
  salesReadiness += {
    Immediate: 10,
    "Within 1 Month": 8,
    "1–3 Months": 6,
    "3–6 Months": 4,
    "6–12 Months": 2,
  }[lead.purchaseTimeline] || 0;
  salesReadiness += { High: 10, Medium: 6, Low: 2 }[lead.urgencyLevel] || 0;
  salesReadiness += {
    "₹25 Lakh+": 5,
    "₹5-25 Lakh": 3,
    "₹1-5 Lakh": 1,
    "Below ₹1 Lakh": 1,
  }[lead.budgetRange] || 0;
  if ((lead.expectedOrderValue || 0) > 0) salesReadiness += 5;

  /* ---- Negative deductions ---- */
  if (lead.qualificationStatus === "Disqualified") negative += 30;
  else if (lead.qualificationStatus === "Not Qualified") negative += 15;
  if (["Lost", "Junk", "Duplicate"].includes(lead.status)) negative += 40;
  if (!has(lead.phone) && !has(lead.mobileNumber)) negative += 10;
  if (!has(lead.email) && !has(lead.alternateEmail)) negative += 5;

  const score = Math.max(
    0,
    Math.min(100, fit + engagement + salesReadiness - negative)
  );

  let leadGrade = "";
  let leadRating = "";
  if (score >= 80) {
    leadGrade = "A";
    leadRating = "Hot";
  } else if (score >= 60) {
    leadGrade = "B";
    leadRating = "Warm";
  } else if (score >= 40) {
    leadGrade = "C";
    leadRating = "Warm";
  } else if (score > 0) {
    leadGrade = "D";
    leadRating = "Cold";
  }

  return {
    leadScore: score,
    leadGrade,
    leadRating,
    scoreBreakdown: { fit, engagement, salesReadiness, negative },
  };
};

module.exports = { calculateLeadScore };
