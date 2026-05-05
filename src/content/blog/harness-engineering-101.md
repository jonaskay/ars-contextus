---
title: "Harness Engineering 101: How to go from zero harness to a harness that survives model upgrades"
description: My advice on how to add your first piece of coding agent harness to your codebase and how to approach its evolution.
headerGradient:
  light: "from-teal-100 via-amber-100 to-teal-100"
  dark: "dark:from-teal-900 dark:via-amber-900 dark:to-teal-900"
publishedDate: 2026-05-05
---

A harness consists of all the context files, scripts, and other artifacts and configurations you’ve set up for your coding agent to do a better job. Every harness built for coding agents exists to patch weaknesses in current models. But models keep getting better, and a harness that once helped you complete a task might now make the agent work slower and consume more tokens for equal (or even lower) success rates.

If you have a line in your `AGENTS.md` file that reads “Write only what is needed,” you might want to stop and think about whether that line is doing you more harm than good. Maybe there was a time in the past when such high-level instructions were needed. But this doesn’t seem to be the case anymore with the latest models. [Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?](https://arxiv.org/abs/2602.11988) found that agent-generated `AGENTS.md` instructions tend to make tasks harder for coding agents to complete. In general, people seem to get more out of current frontier models and coding agents by not over-constraining them with overly detailed instructions. On top of this, the larger your coding agent’s context—which contains not only your prompts but also instructions, skills, MCPs, and other resources you’ve given the agent access to—the higher the risk of context rot.

Because of this, your context files need to be as minimal as possible and under constant evaluation. How do you do this evaluation? You can build evaluation pipelines for your skills and harnesses, but this work takes time and effort that I don’t see many teams having access to. An alternative strategy is to limit the amount of harness that needs these evaluations in the first place. These are my thoughts on the matter.

## Where to start?

This is the only foundational piece I recommend everyone implement: start by writing an `AGENTS.md` (or an equivalent) for your coding agent. Keep it as small as possible and document only the entry points for your agent. Entry points are the commands your coding agent needs to know to run tests, development servers, and so on.

This is my DO NOT DO list for `AGENTS.md`:

- Don’t ask your coding agent to generate the `AGENTS.md` for you (it will do a worse job than you).
- Don’t copy-paste your `AGENTS.md` from another project (you are working in a different context).
- Don’t tell the coding agent what great feature development looks like (that’s something AI providers handle in post-training and system prompts).

## What’s next?

Context files are duct tape. It doesn’t matter whether these files are served via skills, `AGENTS.md`, MCPs, or a custom-made memory system; they are still a quick fix that has a high likelihood of getting in the way of your ever-evolving coding agent. Because of this, try to avoid them as much as possible. In general, providing a way for the agent to validate its own work independently will outlast markdown files that instruct the agent to work in a certain way.

Sometimes context files are the right tool for the job (or the only tool). But they are also tools people reach for too quickly. Resist the urge to write yet another skill and instead put your engineering hat on to think about whether there’s a more reliable way to direct the agent.

Since context files weigh down your agent’s context, every addition needs to be justified. Don’t let yourself or your teammates add anything to context files unless these two conditions are true:

1. The agent ran into an issue and context files are the only way to fix it
2. The agent can solve the issue with the added context, but not without it (actually test this condition)

Issues are things like the agent writing code that doesn’t follow existing patterns, or you having to repeatedly copy-paste the same context or prompts. These are not valid reasons for extending your context files:

- You think your context files are too simple
- Your colleague thinks your context files are too simple
- Someone on the internet thinks your context files are too simple

So what tools can we use in addition to context files to build up our harness? Below are some common issues caused by insufficient harnesses.

## Too much copy-pasting

If you are pasting the same prompt over and over again, you need to add a user-invokable skill. Not long ago, coding agents supported slash commands, but unfortunately these have been replaced by skills. I say “unfortunately” because skill descriptions leave a trace in your agent’s context whether they are user-invokable or not. Slash commands didn’t.

If you are pasting information from your issue manager, the quick fix is to install an MCP for retrieving that information. But do you really need an MCP? Could a simple bash script get the job done? If that option is realistic and available to you, take it. It gives you much more control over context management.

If you keep passing the output of one agent to another (e.g., a planner agent to a developer agent), you could consider subagents to maintain a cleaner context. But again, why use a subagent if a simple bash script can do the same thing? You’ll have more control over context, and multi-agent systems (including subagents) are more fragile and token-hungry than a straightforward programmed process of agents working via hand-offs.

## Too many mistakes

When the agent writes a class the wrong way, the quick fix is to add a “NEVER do …” or “ALWAYS do …” line in `AGENTS.md`. But people often don’t stop to think whether that rule could be implemented as a custom linter rule. Linters can do a lot more than enforce whether variable names should have underscores. I know you probably have little interest in figuring out how to write linter rules. That’s why I suggest vibe-coding them (if you can’t find a ready-made rule).

If something can’t be enforced as a linter rule, consider adding it to plan documents instead of your harness rules and skills. This way, the instruction is only applied when it’s actually relevant. I’m not suggesting you manually remember to add these instructions; the better approach is to separate planning into its own skill and include the instructions there. Planning is such a common pattern that you’ll end up building a skill for it anyway.

If errors are caused by missing documentation, but your docs are already bloated, you need progressive disclosure. That means exposing more skills or documentation through layered context files. In practice, this leads to building an index markdown (e.g. in your `AGENTS.md`) that helps the agent find the right information for a given task.

Another option is to have a second coding agent review the work. The key detail: run the reviewer in a separate agent session. In practice, spinning up a review agent manually is tedious, so you’ll likely want a bash script that does it automatically after the developer agent finishes. Have the reviewer document issues in a markdown file, then spin up another agent to fix them.

## Too many failures

If certain tasks seem impossible for the agent, try these strategies before giving up.

Large codebases are inherently difficult for coding agents. They often contain dead code, inconsistent styles, messy dependencies, and too many files to search. You’ll need to take code architecture more seriously: minimize dependencies and make system boundaries clearer. If you’re unsure where to start, it might be worth revisiting classic software development books, or ask suggestions from your coding agent. These days I personally brainstorm architectural decisions with Claude.ai as this way my existing patterns are not weighing down the model’s recommendations. Obviously, this approach requires for me to know what to ask for in the first place. 

If you’re not doing planning yet, start there (especially for “impossible” tasks). Planning produces a markdown document that guides implementation. If the plan is flawed, the implementation will be too. When fixing plans, look deeper: is the issue missing information, too much information, or the wrong information? Fix the root cause. If that fails, break tasks into smaller pieces to make planning easier. These days coding agents ship with their own planning features but I prefer to customize my planning prompts for my projects as this gives me more control and makes debugging easier.

We’ve already discussed linters, but another critical feedback loop is automated testing. If the plan is solid but implementation keeps failing, have the agent write test cases first and commit them. Then use a separate agent to implement the plan so that the tests pass. This reduces the chance of the agent “fixing” failures by modifying the tests themselves.

If the plan and tests are solid, your chances of success increase significantly. That said, many developers aren’t great at writing tests: they focus on what’s easy to test rather than what should be tested. Test writing is a skill worth improving in the age of coding agents (at least until they consistently outperform you).

## Future posts

I know there are lot of details that go into these suggestions. I'll try my best to share them in future posts. But I'm sure that this advice will help you and your team get started on your harness engineering journey and avoid some of the pitfalls that can slow you down later!