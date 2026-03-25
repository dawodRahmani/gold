# Gold Selling Management System (GS) — Comprehensive System Design

## 1. Overview

GS is a management system built for gold traders in Afghanistan. It handles inventory, multi-currency accounting, customer management, inter-city gold transfers, trust (amanat) gold tracking, and automated WhatsApp notifications.

**Tech Stack:** Laravel 13 · React (Inertia.js) · SQLite/MySQL · WhatsApp API

---

## 2. Gold & Unit Definitions

### 2.1 Ayar (Purity)
Ayar is the purity measurement of gold (similar to karat):
- **24 ayar** = 100% pure gold
- **23.88–24 ayar** = "Pasa" — the local term for pure gold in Afghanistan
- **23.77 ayar** = Common traded gold
- **18 ayar** = 18/24 = 75% pure gold

### 2.2 Weight Units
| Unit | Grams | Notes |
|------|-------|-------|
| Tola | 12.15 g | Primary unit for buying/selling |
| Gram | 1 g | Used in conversions |

> All prices are quoted **per tola**, not per gram.

### 2.3 Key Formulas

**Convert any ayar to 24-ayar equivalent weight:**
```
weight_24ayar = (current_ayar × weight_in_grams) / 24
```

**Calculate USD price of gold:**
```
usd_price = (weight_24ayar / 12.5) × tola_price_usd
```

> Note: 12.5 is used here as a tola-based divisor for gram-to-tola conversion in pricing.

---

## 3. Currencies

The system operates with three currencies simultaneously:
- **USD** — US Dollar
- **AFN** — Afghan Afghani
- **EUR** — Euro

Exchange rates (USD→AFN, EUR→AFN) are entered manually by the user each session or per transaction and stored with each transaction for historical accuracy.

---

## 4. Entities & Data Models

### 4.1 Customers

#### Ordinary Customer
| Field | Type | Notes |
|-------|------|-------|
| id | int | |
| name | string | |
| phone | string | |
| created_at | date | Date of first purchase |
| account_balance | decimal | In gold (tola) or currency |
| notes | text | Optional |

#### Permanent Customer
All ordinary customer fields plus:
| Field | Type | Notes |
|-------|------|-------|
| whatsapp_number | string | For automated notifications |
| address | string | |
| city / province | string | |
| id_number | string | National ID |
| pasa_account | decimal | Balance in pasa (tola) |
| gold_account | decimal | Balance in general gold (tola) |
| usd_account | decimal | Balance in USD |
| afn_account | decimal | Balance in Afghani |
| eur_account | decimal | Balance in Euro |
| customer_type | enum | ordinary / permanent |

### 4.2 Suppliers (Capital/Kabul-based Sellers)

People the shop sells gold to, mostly located in Kabul:

| Field | Type | Notes |
|-------|------|-------|
| id | int | |
| name | string | |
| phone | string | |
| whatsapp_number | string | |
| city | string | e.g., Kabul |
| pasa_account | decimal | Balance in pasa (tola) |
| afn_account | decimal | Balance in Afghani |
| usd_account | decimal | Balance in USD |

### 4.3 Shop Accounts (Internal)

The shop itself maintains these ledger accounts:

| Account | Currency/Unit | Description |
|---------|--------------|-------------|
| USD Account | USD | Shop's dollar balance |
| AFN Account | AFN | Shop's afghani balance |
| Pasa Account | Tola (24 ayar) | Shop's pure gold stock |
| Gold Account | Tola (variable ayar) | General gold stock |

---

## 5. Transaction Types

### 5.1 Buy Gold from Customer
- Customer sells gold to the shop
- Shop's gold account increases
- Customer receives payment (cash or account credit)
- If permanent customer: their account balance updated
- If ordinary customer: transaction recorded with payment details

**Ledger effect:**
```
Shop Gold Account    +weight (tola)
Shop USD/AFN Account -payment amount
Customer Account     +payment (if credit)
```

### 5.2 Sell Gold to Customer or Supplier
- Shop sells gold from its inventory
- Shop's gold account decreases
- Customer/supplier pays (cash or account debit)

**Ledger effect:**
```
Shop Gold Account    -weight (tola)
Shop USD/AFN Account +sale amount
Customer Account     -payment (if account debit)
```

### 5.3 Trust Gold (Amanat / امانت)
- Customer deposits gold with the shop for safekeeping
- Gold remains in the **customer's account** — shop does NOT own it
- Shop's inventory does NOT change
- Shop is responsible for safekeeping only
- Tracked in a separate "trust ledger"

**Ledger effect:**
```
Customer Trust Account  +weight (tola)
Shop Trust Liability    +weight (tola)
(Shop Gold Account — NO CHANGE)
```

### 5.4 Inter-Province Gold Transfer
- Gold is sent between accounts (shop ↔ customer ↔ supplier)
- Common use case: buy in one province, sell in another (e.g., Kabul)
- Both sender and receiver accounts updated

**Fields:**
- from_account (customer / shop / supplier)
- to_account (customer / shop / supplier)
- weight (tola)
- ayar
- transport_cost
- notes

### 5.5 Currency Exchange
- Convert between USD, AFN, EUR
- Exchange rate recorded at time of transaction

---

## 6. Pricing & Rate Management

### 6.1 Daily Rate Entry
At the start of each day (or per transaction), the user enters:
- **Tola Price (USD)** — current market price per tola
- **USD → AFN rate** — current exchange rate
- **EUR → AFN rate** (optional)

These rates are stored per-transaction so historical records remain accurate.

### 6.2 Price Calculation Screen
A dedicated calculator that takes:
- Input: ayar, weight (grams or tola), tola price, exchange rates
- Output: USD price, AFN price, EUR price

---

## 7. Accounting & Ledger

### 7.1 Double-Entry Principle
Every transaction debits one account and credits another. The system enforces balance.

### 7.2 Account Structure
```
Assets
├── Cash (USD, AFN, EUR)
├── Gold Inventory (pasa, general gold)
└── Trust Gold Receivable (not owned, just held)

Liabilities
└── Trust Gold Payable (owed to customers)

Equity
└── Shop Profit/Loss
```

### 7.3 Customer Account Ledger
Each permanent customer has a running balance per:
- Pasa (tola)
- General Gold (tola)
- USD
- AFN
- EUR

---

## 8. WhatsApp Notifications

Every transaction triggers an automatic WhatsApp message to the relevant customer/supplier using the WhatsApp Business API.

### Message Templates:

**Buy transaction:**
```
Dear [Name], we received [X] tola of [ayar]-ayar gold from you.
Amount paid: [USD/AFN]. Date: [date]. Balance: [balance].
```

**Sell transaction:**
```
Dear [Name], you purchased [X] tola of [ayar]-ayar gold.
Amount: [USD/AFN]. Date: [date]. Balance: [balance].
```

**Trust deposit:**
```
Dear [Name], we received [X] tola of gold for safekeeping.
Date: [date]. Your trust balance: [balance] tola.
```

**Transfer:**
```
Dear [Name], [X] tola transferred to [destination].
Date: [date].
```

---

## 9. Reports Module

Reports can be exported as **PDF** or **Excel**.

| Report | Filters | Content |
|--------|---------|---------|
| Daily Transactions | Date | All buys, sells, transfers for the day |
| Weekly Transactions | Week range | Summary + details |
| Monthly Transactions | Month | Summary + details |
| Customer Statement | Customer + date range | Full account history |
| Supplier Statement | Supplier + date range | Full account history |
| Gold Inventory | Date | Current pasa, gold stock |
| Trust Gold | Date | All amanat balances per customer |
| Shop Profit/Loss | Date range | Revenue, cost, net profit |
| Exchange Rate History | Date range | All recorded rates |

---

## 10. User Roles & Permissions

| Role | Permissions |
|------|------------|
| Admin | Full access — all transactions, settings, reports, user management |
| Accountant | View & create transactions, view reports, no user management |
| Viewer | Read-only access to reports and balances |

---

## 11. Application Pages / Screens

### Dashboard
- Today's summary: total bought, total sold, cash balances (USD/AFN), gold stock (tola)
- Quick exchange rate entry
- Recent transactions list

### Customers
- List of all customers (ordinary + permanent)
- Customer detail page: account balances, transaction history
- Add / edit customer form

### Suppliers
- List of suppliers
- Supplier detail: account balances, transaction history

### Transactions
- New transaction form (type selector: buy / sell / trust / transfer)
- Transaction history with filters (date, type, customer, currency)
- Transaction detail view

### Price Calculator
- Input: ayar, weight, tola price, exchange rates
- Output: USD, AFN, EUR prices

### Accounts
- Shop's own account balances (USD, AFN, Pasa, Gold)
- Ledger view per account

### Reports
- Report generator with type, date range, customer/supplier filter
- PDF and Excel export

### Settings
- Exchange rate management
- WhatsApp API configuration
- User management

---

## 12. Database Schema (Summary)

```
users
  id, name, email, password, role

customers
  id, name, phone, whatsapp_number, type (ordinary/permanent),
  address, city, id_number,
  pasa_balance, gold_balance, usd_balance, afn_balance, eur_balance

suppliers
  id, name, phone, whatsapp_number, city,
  pasa_balance, afn_balance, usd_balance

exchange_rates
  id, usd_to_afn, eur_to_afn, tola_price_usd, recorded_at

transactions
  id, type (buy/sell/trust_deposit/trust_withdraw/transfer/exchange),
  customer_id (nullable), supplier_id (nullable),
  gold_weight_tola, ayar, gold_weight_24ayar,
  amount_usd, amount_afn, amount_eur,
  exchange_rate_id,
  notes, created_at, created_by

trust_balances
  id, customer_id, weight_tola, ayar, deposited_at, notes

gold_transfers
  id, from_type (shop/customer/supplier), from_id,
  to_type (shop/customer/supplier), to_id,
  weight_tola, ayar, transport_cost, date, notes

shop_accounts
  id, account_type (usd/afn/eur/pasa/gold), balance, updated_at
```

---

## 13. Business Rules

1. **Pasa vs. Gold:** Pasa (23.88–24 ayar) is tracked separately from general gold. Conversions between them require an ayar adjustment.
2. **Trust gold is never counted as shop inventory.** It has its own ledger.
3. **All transactions must record the exchange rate** at time of transaction.
4. **Tola = 12.15 grams** is fixed for all calculations.
5. **Prices are always in tola**, never in grams directly to the user.
6. **WhatsApp message must be sent** for every completed transaction (can be queued if API is unavailable).
7. **Permanent customers** get full account management; ordinary customers get transaction records only.
8. **Suppliers** always have pasa, AFN, and USD accounts.

---

## 14. Implementation Phases

### Phase 1 — Core Foundation
- Database schema setup
- Authentication & user roles
- Customer & supplier management (CRUD)
- Exchange rate entry

### Phase 2 — Transactions
- Buy/sell gold transactions
- Price calculator
- Shop account ledger

### Phase 3 — Trust & Transfers
- Trust gold (amanat) deposits/withdrawals
- Inter-province gold transfers

### Phase 4 — Notifications
- WhatsApp API integration
- Message templates per transaction type

### Phase 5 — Reports
- Daily/weekly/monthly transaction reports
- Customer/supplier statements
- PDF and Excel export

### Phase 6 — Polish
- Dashboard with live summaries
- Audit log
- Data backup

---
