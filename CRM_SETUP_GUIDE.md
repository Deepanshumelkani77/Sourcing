# IndoChinaBridge CRM System - Setup Guide

## Overview
A professional CRM system for managing leads, customers, quotations, and deals for IndoChinaBridge's China-to-India sourcing business.

## ✅ Completed (Database Models)

### 1. Lead Model (`backend/models/Lead.js`)
- Customer name, company name, phone, WhatsApp, email
- Product requirement, quantity
- Source tracking (Website, WhatsApp, Exhibition, Referral, etc.)
- Assigned sales person
- Status: New, Contacted, Qualified, Converted, Lost
- Priority: Low, Medium, High, Urgent
- Follow-up date, notes, deal value
- Conversion tracking to customer

### 2. Customer Model (`backend/models/Customer.js`)
- Customer name, company name, contact details
- Address (city, state, country, pincode)
- GST number, PAN number
- Source tracking
- Assigned sales person
- Status: Active, Inactive, Blacklisted
- Total orders, total revenue tracking
- Lead reference

### 3. FollowUp Model (`backend/models/FollowUp.js`)
- Linked to Lead or Customer
- Type: Call, Email, WhatsApp, Meeting, Visit, Other
- Scheduled date, completed date
- Status: Scheduled, Completed, Missed, Cancelled
- Outcome tracking
- Notes, next follow-up date
- Assigned to sales person

### 4. Deal Model (`backend/models/Deal.js`)
- Deal number (auto-generated)
- Linked to Customer, Lead, Quotation
- Title, description, deal value
- Stage pipeline: Lead → Qualified → Proposal Sent → Negotiation → Won/Lost/On Hold
- Probability percentage
- Expected/actual closing date
- Products list with pricing
- Payment terms, delivery terms
- Source/destination country
- Lost reason tracking

### 5. CRMQuotation Model (`backend/models/CRMQuotation.js`)
- Quotation number (auto-generated)
- Linked to Customer, Lead, Deal
- Title, validity period
- Status: Draft, Sent, Accepted, Rejected, Expired
- Total amount, currency
- Items list with product details
- Terms, payment terms, delivery terms
- Sent date, accepted date tracking

## ✅ Completed (Backend Controllers)

### CRM Lead Controller (`backend/controllers/crmLeadController.js`)
- ✅ Create lead
- ✅ Get all leads (with filters)
- ✅ Get single lead
- ✅ Update lead
- ✅ Delete lead
- ✅ Convert lead to customer
- ✅ Get lead statistics

## 🚧 Remaining Work

### Backend API Endpoints
1. Customer controller (CRUD operations)
2. Follow-up controller (CRUD operations)
3. Deal controller (CRUD operations)
4. CRM Quotation controller (CRUD operations)
5. Dashboard controller (statistics and analytics)
6. Route files for all CRM endpoints
7. Middleware for CRM authentication

### Frontend Components
1. CRM Dashboard Layout with Sidebar
2. Dashboard Home (metrics, charts, recent leads)
3. Lead Management (list, create, edit, convert)
4. Customer Management (list, create, edit, view orders)
5. Follow-up System (calendar view, scheduling)
6. Quotation Management (create, send, track)
7. Deal Pipeline (Kanban board view)
8. Reports & Analytics

### Key Features to Implement
- **Dashboard**: Total leads, new leads, active deals, won deals, revenue
- **Lead Management**: Create from contact form, manual entry, status updates
- **Customer Portal**: Customer 360 view, order history, communication log
- **Follow-up Reminders**: Calendar integration, due date alerts
- **Quotation System**: PDF generation, email sending, version control
- **Deal Pipeline**: Visual Kanban board, drag-and-drop stage updates
- **Reports**: Sales performance, conversion rates, revenue by source

## 📋 Next Steps Priority

1. **HIGH PRIORITY**
   - Complete remaining backend controllers
   - Create CRM routes
   - Build CRM dashboard layout
   - Implement lead management UI

2. **MEDIUM PRIORITY**
   - Customer management UI
   - Follow-up system UI
   - Deal pipeline (Kanban)
   - Dashboard with charts

3. **LOW PRIORITY**
   - Advanced reports
   - Email automation
   - PDF quotation generation
   - Calendar integration

## 🔧 Installation Instructions

1. Models are already created in `backend/models/`
2. Add controllers to `backend/controllers/`
3. Create routes in `backend/routes/crmRoutes.js`
4. Add routes to `backend/server.js`
5. Build frontend React components in `frontend/src/pages/crm/`

## 📊 Database Schema Flow

```
Contact Form → Lead → Follow-ups
                ↓
            Customer → Deals → Quotations
                ↓
            Orders (existing)
```

## 🎯 CRM Pipeline Stages

```
Lead → Contacted → Qualified → Proposal Sent → Negotiation → Won/Lost
```

## 💡 Business Logic

1. **Lead Capture**: Automatic from website contact form
2. **Lead Assignment**: Auto-assign or manual to sales team
3. **Follow-up Schedule**: Set reminders based on priority
4. **Quotation**: Create from lead, send to customer
5. **Deal Creation**: When quotation accepted
6. **Customer Conversion**: Lead becomes customer on first order
7. **Revenue Tracking**: Sum of all won deals per customer

## 🔐 Access Control

- Only Admin users can access CRM
- Sales team can only see their assigned leads
- Manager can view all leads and team performance
