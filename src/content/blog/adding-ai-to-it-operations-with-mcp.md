---
title: 'Adding AI to IT Operations with Model Context Protocol'
description: 'How I built an MCP server that enables natural language queries against internal IT data, making complex data accessible through conversational AI.'
pubDate: '2026-03-06'
tags: ['AI', 'MCP', 'automation', 'TypeScript']
draft: true
---

## What is MCP

Model Context Protocol (MCP) is an open standard that lets AI assistants connect to external data sources and tools. This section will explain the protocol at a high level, how it differs from simple RAG or plugin approaches, and why it's well-suited for exposing internal IT systems to conversational AI.

## The problem (data silos)

IT data lives everywhere: CMDBs, license servers, Slack, ticketing systems. Answering a simple question like "How many licenses do we have for Product X?" often requires multiple dashboards and manual correlation. This section will describe the data silo problem and how it slows down both operations and decision-making.

## Building the server

A walkthrough of building an MCP server in TypeScript: defining tools and resources, connecting to internal APIs and databases, handling authentication, and ensuring safe access patterns. I'll include code snippets and architectural decisions.

## Use cases and examples

Concrete examples of what the MCP server enables: "What's our license utilization for Adobe Creative Cloud?" "Which channels haven't had activity in 90 days?" "Show me the inventory for Building 3." This section will show before/after workflows and the impact on query time.

## Impact on the team

How the team adopted the tool, what queries they run most often, and the unexpected benefits—like non-technical stakeholders being able to self-serve data questions. I'll also touch on limitations and where human review is still required.
