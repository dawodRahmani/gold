# GS — Frontend Work Plan (UI Only)

> All pages use **static/mock data** for now. No backend wiring yet.
> Stack: React · Inertia.js · Tailwind CSS · shadcn/ui · RTL (Dari)

---

## Phase F1 — Layout & Shell ✅ (Done)

Everything needed to navigate the app is in place.

| Item | Status |
|------|--------|
| RTL layout (`dir="rtl"`) | ✅ |
| Vazirmatn font (Dari) | ✅ |
| Gold color theme | ✅ |
| Login page (styled, Dari) | ✅ |
| Sidebar (right-side, Dari nav items) | ✅ |
| Dashboard shell with stat cards | ✅ |

---

## Phase F2 — Customers Module

### Pages to build

#### 1. مشتریان — Customer List (`/customers`)
- Search bar (by name or phone)
- Filter tabs: همه | دایمی | موقتی
- Table columns: نام، شماره تلفن، نوع، موجودی طلا، موجودی دالر، تاریخ عضویت، عملیات
- "مشتری جدید" button → opens create form
- Click row → go to customer detail

#### 2. ثبت مشتری جدید — Create/Edit Customer (`/customers/create`, `/customers/:id/edit`)
**Two-section form:**
- **بخش اول — معلومات اساسی** (both types)
  - نام و تخلص
  - شماره تلفن
  - نوع مشتری (موقتی / دایمی) — radio/toggle
  - یادداشت
- **بخش دوم — معلومات تکمیلی** (permanent only, shown/hidden based on type)
  - شماره واتساپ
  - آدرس
  - ولایت / شهر
  - شماره تذکره

#### 3. پروفایل مشتری — Customer Detail (`/customers/:id`)
- Header card: name, phone, type badge, join date
- **Account balances strip:** پاسا | طلا | دالر | افغانی
- **Tabs:**
  - تراکنش‌ها — transaction history table (mock rows)
  - امانت — trust gold balance and history
  - معلومات — full profile info

---

## Phase F3 — Suppliers Module

### Pages to build

#### 1. سپلایرها — Supplier List (`/suppliers`)
- Table: نام، شهر، موجودی پاسا، موجودی دالر، موجودی افغانی، عملیات
- "سپلایر جدید" button

#### 2. ثبت سپلایر — Create/Edit Supplier (`/suppliers/create`, `/suppliers/:id/edit`)
- نام، شماره تلفن، شماره واتساپ، شهر (default: کابل)

#### 3. پروفایل سپلایر — Supplier Detail (`/suppliers/:id`)
- Account balances: پاسا | دالر | افغانی
- Transaction history tab (mock)

---

## Phase F4 — Transactions Module

### Pages to build

#### 1. تراکنش‌ها — Transaction List (`/transactions`)
- Filter bar: نوع (خرید/فروش/امانت/انتقال) | تاریخ از-تا | مشتری
- Table: تاریخ، نوع، مشتری/سپلایر، مقدار (تولا)، عیار، مبلغ (دالر)، مبلغ (افغانی)، وضعیت
- Color-coded type badges (green=خرید، red=فروش، blue=امانت، orange=انتقال)
- Click row → detail drawer/modal

#### 2. تراکنش جدید — New Transaction (`/transactions/create`)
**Step-based form (3 steps):**

**Step 1 — نوع تراکنش**
Four big cards to pick from:
- 📥 خرید طلا (Buy from customer)
- 📤 فروش طلا (Sell to customer/supplier)
- 🔒 امانت‌گذاری (Trust deposit)
- 🔄 انتقال طلا (Transfer)

**Step 2 — جزئیات** (fields change per type)

*خرید / فروش fields:*
- مشتری یا سپلایر (searchable select)
- عیار طلا (number input + preset buttons: 18 | 21 | 22 | 23.77 | 24)
- وزن (گرام or تولا toggle)
- نرخ تولا (USD)
- نرخ دالر به افغانی
- نوع پرداخت: نقد | حواله حساب

*امانت fields:*
- مشتری (searchable select)
- عیار
- وزن
- یادداشت

*انتقال fields:*
- از (from: shop / customer / supplier)
- به (to: shop / customer / supplier)
- وزن و عیار
- هزینه ترانسپورت

**Step 3 — تأیید**
- Summary card showing all entered values
- Calculated amounts: معادل ۲۴ عیار، قیمت دالر، قیمت افغانی
- "ثبت تراکنش" confirm button

#### 3. جزئیات تراکنش — Transaction Detail (modal or `/transactions/:id`)
- All fields displayed in a clean layout
- Status badge
- Print button (future)

---

## Phase F5 — Price Calculator

### Page: ماشین حساب طلا (`/calculator`)

**Two-column layout:**

Left column — inputs:
- عیار طلا (number + presets: 18 / 21 / 22 / 23.77 / 24)
- وزن (toggle: گرام | تولا)
- نرخ تولا (USD)
- نرخ دالر به افغانی
- نرخ یورو به افغانی (optional)

Right column — live results (update as you type):
- معادل ۲۴ عیار: X.XX گرام
- قیمت به دالر: $X,XXX.XX
- قیمت به افغانی: X,XXX,XXX ؋
- قیمت به یورو: €X,XXX.XX (if rate entered)

Below: conversion reference table
| عیار | وزن اصلی | معادل ۲۴ عیار | قیمت دالر |
|------|---------|--------------|----------|

---

## Phase F6 — Accounts Overview

### Page: حساب‌های فروشگاه (`/accounts`)

**Shop balance cards (4 big cards):**
- 💰 دالر (USD)
- 💴 افغانی (AFN)
- ⚜ پاسا (Tola, 24 ayar)
- 🥇 طلای عمومی (Tola, variable ayar)

**Per-account ledger table** (tabs for each account):
- تاریخ | توضیح | بدهکار | بستانکار | مانده
- Filter by date range

---

## Phase F7 — Reports

### Page: گزارشات (`/reports`)

**Report type selector (card grid):**
- 📅 روزانه
- 📆 هفتگی
- 🗓 ماهانه
- 👤 کارت مشتری
- 🏢 کارت سپلایر
- 🥇 موجودی طلا
- 🔒 طلای امانتی
- 📈 سود و زیان
- 💱 نرخ ارز

**Filter panel** (shown after selecting type):
- تاریخ از / تا
- مشتری (for customer statement)
- سپلایر (for supplier statement)

**Preview area:**
- Mock table/chart matching selected report
- دانلود PDF button (disabled for now)
- دانلود Excel button (disabled for now)

---

## Phase F8 — Settings

### Page: تنظیمات (`/settings`)

**Tabs:**

#### نرخ ارز — Exchange Rates
- Form: نرخ فعلی دالر به افغانی، نرخ یورو به افغانی، نرخ تولا (دالر)
- History table of past rates

#### واتساپ — WhatsApp API
- API key input
- Test number field
- "ارسال پیام آزمایشی" button (disabled for now)

#### کاربران — User Management
- Table: نام، ایمیل، نقش (Admin/Accountant/Viewer)، وضعیت
- "کاربر جدید" button
- Role badge colors: red=Admin, blue=Accountant, gray=Viewer

---

## Component Library to Build

These reusable components will be used across all phases:

| Component | Used in |
|-----------|---------|
| `StatCard` | Dashboard, Accounts |
| `GoldBadge` (عیار badge) | Transactions, Calculator |
| `TypeBadge` (transaction type) | Transaction list |
| `CustomerSelect` (searchable) | Transaction form |
| `WeightInput` (gram/tola toggle) | Transaction form, Calculator |
| `AyarPresets` (18/21/22/23.77/24 buttons) | Transaction form, Calculator |
| `CurrencyDisplay` (USD/AFN/EUR formatted) | Everywhere |
| `AccountBalanceStrip` | Customer detail, Supplier detail |
| `EmptyState` | All list pages |
| `ConfirmDialog` | Delete actions |
| `DateRangePicker` | Reports, Transaction filter |

---

## Page Route Map

```
/dashboard              داشبورد
/customers              لیست مشتریان
/customers/create       مشتری جدید
/customers/:id          پروفایل مشتری
/customers/:id/edit     ویرایش مشتری
/suppliers              لیست سپلایرها
/suppliers/create       سپلایر جدید
/suppliers/:id          پروفایل سپلایر
/suppliers/:id/edit     ویرایش سپلایر
/transactions           لیست تراکنش‌ها
/transactions/create    تراکنش جدید
/transactions/:id       جزئیات تراکنش
/calculator             ماشین حساب طلا
/accounts               حساب‌های فروشگاه
/reports                گزارشات
/settings               تنظیمات
```

---

## Build Order Recommendation

```
F2 (Customers) → F3 (Suppliers) → F4 (Transactions) → F5 (Calculator) → F6 (Accounts) → F7 (Reports) → F8 (Settings)
```

Start with **F2 Customers** — it establishes the list + detail + form pattern
that every other module reuses.
