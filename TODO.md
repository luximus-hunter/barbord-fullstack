# Barbord Monorepo - TODO List

## @repo/api

- [x] API versioning
- [x] CORS configuration
- [ ] Data routes
  - [x] Admin
  - [x] Announcement
  - [x] Auth
  - [x] Automatic Topup
  - [x] Order
  - [x] Product
  - [x] Product Category
  - [x] Product Image
  - [ ] Product Order History
    - [ ] GET: `/product-order-history`
    - [ ] POST: `/product-order-history`
    - [ ] GET: `/product-order-history/:historyId`
    - [ ] PUT: `/product-order-history/:historyId`
    - [ ] DELETE: `/product-order-history/:historyId`
    - [ ] GET: `/product-order-history/:historyId/rows`
    - [ ] POST: `/product-order-history/:historyId/rows`
    - [ ] PUT: `/product-order-history/rows/:historyRowId`
    - [ ] DELETE: `/product-order-history/rows/:historyRowId`
  - [ ] Product Stock History
    - [ ] GET: `/product-stock-history`
    - [ ] POST: `/product-stock-history`
    - [ ] GET: `/product-stock-history/:stockId`
    - [ ] PUT: `/product-stock-history/:stockId`
    - [ ] DELETE: `/product-stock-history/:stockId`
    - [ ] GET: `/product-stock-history/:stockId/rows`
    - [ ] POST: `/product-stock-history/:stockId/rows`
    - [ ] PUT: `/product-stock-history/rows/:stockRowId`
    - [ ] DELETE: `/product-stock-history/rows/:stockRowId`
  - [x] Settings
  - [x] Shop
  - [x] Topup
  - [x] User

## @repo/web

- [ ] Fill in TODO list
- [ ] Depend on API version

## @repo/desktop

- [ ] Fill in TODO list

## @repo/db

- [x] Database schema design
- [x] Prisma setup

## @repo/contract

- [x] Define data schemas

## @repo/gateway

- [x] Define data interactions
- [x] Create fetchWithSchema utility
  - [x] Add localStorage caching support
  - [x] Add localStorage cache invalidation support
  - [x] Add schema validation support for body and response
  - [ ] Add invalidation calls to relevant methods
  - [x] Add token usage to methods
  - [x] Implement token usage
- [x] Add API versioning support
