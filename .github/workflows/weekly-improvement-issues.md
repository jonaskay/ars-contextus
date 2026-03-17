---
description: Scans the codebase all types of improvements

on:
  schedule: weekly
  workflow_dispatch:

permissions:
  actions: read
  contents: read
  issues: read
  pull-requests: read

engine: copilot

tools:
  github:
    toolsets: [default]

network: defaults

safe-outputs:
  create-issue:
    max: 3
  noop:

---

# weekly-improvement-issues

Find concrete, high-impact improvements for this repository and draft GitHub issues for the best opportunities.
