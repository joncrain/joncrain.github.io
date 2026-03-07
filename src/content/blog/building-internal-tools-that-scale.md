---
title: 'Building Internal Tools That Scale: Lessons from a Full-Stack Platform'
description: 'How I built a full-stack internal platform at Unity Technologies using Next.js, tRPC, and Drizzle that automated operations and scaled beyond team headcount.'
pubDate: '2026-03-06'
tags: ['TypeScript', 'Next.js', 'tRPC', 'platform-engineering']
draft: true
---

## Introduction (the problem)

Internal tools at scale present a unique challenge: operations teams need powerful automation, but traditional approaches either require massive headcount or leave critical workflows manual. This section will cover the specific pain points I encountered—license sprawl, inventory chaos, and forecasting guesswork—that motivated building a proper platform instead of more one-off scripts.

## Architecture choices (why full-stack TypeScript)

Why a full-stack TypeScript approach (Next.js, tRPC, Drizzle) over alternatives like a separate API + React app or a Python backend? This section will walk through the decision criteria: end-to-end type safety, developer velocity, and the ability for a small team to own the full stack without context switching.

## Key features built (license mgmt, inventory, forecasting)

A tour of the three major feature areas: license management (tracking, allocation, reclamation), inventory (hardware lifecycle, location tracking, depreciation), and forecasting (usage trends, capacity planning, budget projections). Each subsection will describe the problem space and how the platform addressed it.

## Lessons learned

What worked and what didn't. Topics include: the value of tRPC for internal tooling, Drizzle vs. raw SQL tradeoffs, handling permissions and audit trails, and the importance of making the tool "sticky" so teams actually use it.

## What I'd do differently

Retrospective on architecture, tooling, and process. Would I still choose the same stack? How would I approach state management and real-time updates? What would I automate earlier in the build?
