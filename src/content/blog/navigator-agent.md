---
title: Navigator Agent
description: "Learn the Navigator Agent pattern: a pair-programming workflow where AI guides implementation while you write the code, build deeper understanding, and sharpen your technical judgment."
type: pattern
image: ../images/a-quadrant-and-a-sextant.jpg
imagePosition: "object-[50%_50%]"
headerGradient:
  light: "from-emerald-50 to-blue-50"
  dark: "dark:from-blue-950 dark:to-blue-800"
publishedDate: 2026-09-06
---

Navigator Agent is a pattern for learning new programming languages and libraries. It’s also an effective pattern for situations where you absolutely need to understand everything that’s happening in the implementation.

The idea is simple: Assume a pair programming setup with a driver and a navigator. The driver, or the person who types the code, is you. The navigator, or the person who observes the code and chooses the implementation strategy, is your agent.

Why does this work?

- Every now and then, we get tired and just want someone to tell us what to do. If your coding agent is able to implement changes to your codebase effortlessly, it’s also capable of instructing you, the human, on how to implement those changes.
- Sometimes we are implementing foundational or critical logic that we want to understand fully. When you write the code yourself, you end up developing this understanding automatically.
- Pair programming sessions with senior developers usually end with you learning a trick or two about a language you thought you already knew everything about. Coding agents hold more information in their heads than even the most experienced developer at your company.

**But most importantly, this pattern pushes you not to outsource your learning to agents.**

Even though we can now switch between programming languages with ease with the aid of coding agents, it’s still critical for you to know what a great implementation looks like in a given tech stack.

If you lack the taste needed to judge agentic outputs, you can’t judge the true effectiveness of your harness. You can work around this by asking more skilled people to rate the outputs, but this takes more time and results in more lossy feedback.

A harness engineer who is able to dog-food their own experiments will always outperform a harness engineer who always needs to loop in others.

## Example

Add the following user-invokable skill. It assumes a Go project, an existing GitHub integration, and arguments containing a GitHub issue number.

```text
---
name: navigate-issue
description: Walk the user through implementing a GitHub issue themselves, teaching Go as needed
---

Look up GitHub issue $ARGUMENTS.

Guide the user through the implementation step by step. The user writes all the code.

The user does not know Go. When writing Go code, explain language constructs, syntax, and conventions. Don't assume familiarity with Go-specific patterns.
```

When working with the agent, remember to keep asking questions about syntax and patterns that you don’t understand.

As you become more familiar with the tech stack, you’ll end up adjusting the skill to avoid having the most basic concepts explained over and over again.

## Warnings

I have only tried this pattern in settings where I control the full harness. If you want to use this pattern in a team setting where your team has dozens of skills and instructions in the codebase, you might end up experiencing a lot of conflicts between the instructions.
