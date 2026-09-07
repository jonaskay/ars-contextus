---
title: Planning with Gherkin
description: "Use Gherkin during planning to help coding agents write fewer, higher-value integration, system, and E2E tests with a simple human-in-the-loop workflow."
type: pattern
image: ../images/cucumber.jpg
imagePosition: "object-[50%_50%]"
publishedDate: 2026-09-07
---

Well-written integration, system, and E2E tests are probably the best way to communicate intent. They are also a critical part of building confidence that you didn’t break anything when pushing a change to production. You could replace all your unit tests with integration tests, but you couldn’t replace all your integration tests with unit tests.

But they come with a real cost:

- These tests take longer to run, meaning full test runs will eventually become extremely annoying to wait for.
- They are flaky, meaning your tests will often fail “just because,” which results in wasted investigative work to determine whether something is actually wrong with the code.
- Many changes require you to update them, meaning that the more tests you have, the more overhead you will have in your changes.

If you feel that these concerns are theoretical or specific to certain E2E frameworks, I can assure you: you will start feeling these problems after 100 test cases, even with modern stacks. And things only get worse from there.

You have probably noticed that agents love writing test cases for your integration tests. Part of this might be a post-training problem, and part of it might be because writing great test cases requires more context than fits into the effective context window of even the latest and most powerful frontier models.

This results in the following problem: How do you have agents write integration tests without ending up with too many integration tests?

I have found that instructing your coding agent to write only critical test cases still leads to too many low-value test cases and too many low-value assertions in high-value tests.

## Pattern

The pattern works like this:

* When creating a plan with a coding agent, instruct the coding agent to write the planned integration/system/E2E tests as Gherkin in the plan.
* When reviewing the plan, review and modify the Gherkin test cases.
* When implementing the plan, instruct the agent to write only the integration/system/E2E tests that were listed in the plan.

This way, you can add a high-value human-in-the-loop step to your planning process.

Why write Gherkin instead of actual test code in the plan?

- Reading and modifying Gherkin is fast. LLMs also know Gherkin, and you don’t need to follow strict Gherkin syntax.
- You don’t have to think about what goes into the setup and teardown steps of your tests.
- The agent has room to finesse the test case to fit the final implementation instead of forcing the implementation to follow the test case to the letter.

This pattern is not your typical behavior-driven development. If you have previously used Gherkin, you probably stored an index of all the Gherkin statements that mapped to actual test code. Maintaining this index is tedious and offers very little value to testers and developers who could just as easily write the actual test code.

**You do not store any Gherkin statements in this pattern. You use Gherkin simply to communicate the intent of the test cases.**

## Example

Write the following user-invokable skill. In this example, we are only writing system tests. `plan.example.md` is an example plan that, in our case, would contain one example system test:

```text
---
name: create-plan
description: Generate a markdown plan for a change, including critical-path system tests
---

Generate a plan for the following change: $ARGUMENTS

System tests are expensive. Include only one or two critical paths as system tests.
Write these test cases in Gherkin.

Write the plan to `docs/plan.md`.

Use `docs/examples/plan.example.md` as a format reference.
```

After `plan.md` is created, review the test cases by deleting unnecessary assertions and test cases. If a critical test case or assertion is missing, I find it usually faster to ask the agent to add it rather than starting to write it myself.

Then add and run the following user-invokable skill:

```
---
name: implement-plan
description: Implement a plan from docs/plan.md, generating its system tests
---

Read `docs/plan.md`. Implement the plan.

Generate a system test case (or extend an existing system test case) only for the described system test cases.
```
