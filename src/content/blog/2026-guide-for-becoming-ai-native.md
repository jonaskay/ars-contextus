---
title: My 2026 guide for becoming an AI-native developer
description: "A practical 2026 guide to becoming an AI-native developer with coding agents, covering context, harness engineering, software factories, feedback loops, and validation."
type: post
image: ../images/signs-of-the-zodiac-aquarius.jpg
imagePosition: "object-[50%_0%]"
publishedDate: 2026-09-10
---

I received this question last week:

> I’m working as a developer with an existing codebase, and the only agentic coding tool I have access to is GitHub Copilot inside VS Code. How can I become AI-native in this setting?

We all learn in different ways. This is what I have found useful for me.

## Tooling

First of all, if you have access to GitHub Copilot inside VS Code, you have everything you need to learn the art. A year ago, I wouldn’t have been able to say the same, but GitHub Copilot has caught up fast with the other coding agents when it comes to available features and quality.

Second, figure out if you can also install the GitHub Copilot CLI. If not, ask around to see if there’s a good reason why this is the case. At least at the beginning of 2026, many organizations had the CLI disabled in their organization settings because it had to be manually enabled.

If you don’t have access to the CLI, you will still be able to learn all the concepts you need to know. You’ll just end up doing more stuff manually.

More about your environment setup later in the post.

## LLMs

I personally believe that locking in some fundamental understanding of LLMs gives you more “empathy” towards LLMs. This empathy translates into better adjustment of expectations and a better understanding of how to be more helpful as a user of these new tools.

I’m assuming you have some basic idea of how LLMs work: they receive inputs as tokens and then output tokens by “predicting” which tokens should follow that input.

I have found it helpful to know the basics of how LLMs are built because this has helped me understand what types of considerations and decisions labs are already making on my behalf and where I shouldn’t try to be more clever than the people making these models. Whenever I see someone creating skills to make LLMs “think better,” I wonder if they would delete those skills if they only saw what goes into post-training.

This clip from an episode of the Lex Fridman Podcast has two researchers explaining the process of LLM training: [How AI is trained: Pre-training, mid-training, and post-training explained | Lex Fridman Podcast](https://www.youtube.com/watch?v=MJxwtLtNyF8)

In addition, [Computerphile](https://www.youtube.com/user/Computerphile) contains lots of cool videos about the topic.

## Context windows

Everyone knows that you should give relevant context to coding agents. But these two issues with large and noisy contexts are often missed.

### I. Effective context window < Theoretical context window

The context window is the limit within which your input and output tokens MUST fit. That is the hard boundary you have to work with.

The longer your context is, the worse the model becomes at retrieving the right information and reasoning about it. After some point, things start to really degrade. That is the effective context window.

### II. Attention is zero-sum

An LLM needs to decide which tokens matter most among its input tokens. Every irrelevant or random fact reduces the weight the model can assign to more important details.

In addition, LLMs assign higher attention weights to the beginning and end, even if those parts are not semantically relevant.

### Why is this important?

Learning how to manage your context is a critical skill when working with coding agents. 

Too many people are trying to solve the shortcomings of coding agents by giving them even more context. These fundamentals about context windows will help you understand on a deeper level why, most of the time, the answer is not *more* context but *less noisy* context.

A great place to get started with understanding why you want to be frugal with your context is Chroma’s technical report on context rot: [Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://www.trychroma.com/research/context-rot).

## Instructions, skills, subagents

I have found Claude Code’s Best Practices page to be the best source for describing how you should use coding agents and their wide variety of features: [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)

It covers tons of ground and provides easy-to-understand examples. I would use that as my manual for relearning the operating principles of my coding agent even if I wasn’t using Claude Code. I’d just figure out how everything ports to my coding agent.

If you have used only one coding agent, and it’s one of the popular ones, I can guarantee that you are not missing out on anything. There are small usability differences and design decisions here and there, but the core flows and features are the same.

## Harness engineering

To start your journey into harness engineering, I’d suggest reading the post that coined the term: [My AI Adoption Journey
](https://mitchellh.com/writing/my-ai-adoption-journey)

In addition to the affirmation you might need for your learning journey, the post provides two key tips once you understand pretty well what your coding agent can do at the feature level:

1. Finish your workday by sending an agent off to do something for you that you can return to the next day.
2. Whenever you see your agent doing something wrong, don’t fix it by telling the agent how to fix it. Instead, stop and think about why the agent made that mistake and try to add or remove something from your harness to prevent it from happening in the future.

The first point will help you start thinking about agents as background workers. I did it for a week, and it really opened my mind to the opportunities of async agents. I understand that this is also where the available tools can become a limitation for you.

The second point is the core idea of harness engineering. To dive deeper into the scope of harness engineering, read OpenAI’s case study, which contains a lot of pointers about the relevant dimensions (more about this later): [Harness engineering: leveraging Codex in an agent-first world
](https://openai.com/index/harness-engineering/)

## Software factories

Getting your coding agent to complete tasks for you as you prompt it is the level where you can already pat yourself on the shoulder and say that you have successfully adopted AI into your workflows.

But obviously, we want to go deeper.

Building the “software factory” that does the work for you is the next goal. To learn more about the concept, see: [Software Factories, Light and Dark
](https://addyosmani.com/blog/software-factories/).

But to paraphrase the great game designer Reiner Knizia, it is the goal that is important, not the factory. The purpose of this exercise is to learn, not to force the software factory pattern onto organizations and domains where it just doesn’t work.

Your current coding tasks contain simple tasks that you could give directly to your coding agent without touching any of the code yourself. The size of this pool of automatable tasks depends on your codebase. If you cannot get a single task completed with agents, the problem might be with your codebase (or between the keyboard and chair).

Building a factory from the ground up for a new codebase is much easier than wrangling the Jira tickets of a dusty Java project onto a smooth-flowing assembly line.

But nonetheless, you should start figuring out where the limits of that pool are for you and your team. Ideally, you want to get to a flow where a small bug ticket appears in your backlog and suddenly there’s a PR ready for it. This will save your team a lot of coordination work.

### Design principles

Don’t start by planning out the structure of your factory and writing out the multiple steps before making sure that you can move a task from the backlog to a PR manually without touching the code.

Building and designing these things is different from how we build and design deterministic software. You never really know how well things are working before you do your first run. Not only do you waste a lot of time by planning and building too much in advance, but you also limit your creativity, as you end up boxing in your thinking by trying to make the wrong solution work instead of rethinking everything.

The integrations and connections to different APIs are also the uninteresting part. Don’t waste time figuring out how you can automatically retrieve a ticket from your backlog software. Copy the ticket content and add it as a local Markdown file to your codebase.

### Setting up your environment

These are things that you need to take into consideration locally as you get ready for your personal software factory:

- Git worktrees will make it easy to prevent you and your other agents from stepping on each other’s toes. This video from Brian Casel will get you up to speed with the technique: [Claude Code Multitasking Made EASY
](https://www.youtube.com/watch?v=Bz5fyyCa2-0)
- Install a coding agent that you can run in a “headless” mode from the terminal so that you can create scripts for agent invocations. Get comfortable hooking different agents together using Bash scripts (one agent returns success, then another agent starts working, etc.). If you don’t have access to such an agent due to, for example, a security policy, congratulations: you are the Bash script.
- Software factory loops require you to run agents that don’t have to ask for permissions. Because of this, you should learn about the concept of [the lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/). After that, look into the sandboxing solutions that are available to you and whether you and your team can accept the risks of those solutions.

### Process for building a factory

Start building the factory step by step:

1. See if you can get to quality PRs without a plan document.
2. If this doesn’t work, start creating plans for the tickets using your own prompt. If you get a good result, turn that prompt into a skill that you can call later. Then start prompting your agent to pick up the plan and implement it.
3. If the plan doesn’t work, start improving your feedback loops and adding evaluation steps (more about this later). Keep iterating until you get the PR you need.
4. Pick the next task and repeat the process.

The [OpenAI’s harness engineering case study](https://openai.com/index/harness-engineering/) mentioned above has been an extremely helpful compass for me when moving through those steps. Keep one eye on your codebase and the other on the case study. You will realize that it’s a much better map than it seems at first blush.

These are the points I urge you to pay special attention to:

- Early extraction
- Feedback loops
- Evaluator agents
- Validation at scale

#### Early extraction

Early extraction is needed to reduce the number of dependencies coding agents need to know about when making changes to a codebase. Experienced developers usually do better by allowing the codebase to grow organically and extracting things only when the necessary patterns become apparent.

But the less time you end up spending inside the code, the harder it will be for you to discover the necessary abstractions and refactorings. You could ask coding agents to look for refactoring opportunities, but when they perform this analysis, it will be superficial and not based on any actual experienced pain.

#### Feedback loops

Feedback loops are a critical part of enabling an agent running in a loop to verify its work. A skill that tells the agent to put the teardown phase of a test file after the setup phase is not a feedback loop. A linter rule that forces that behavior is a feedback loop.

If you think feedback loops are limited to linters and automated tests, see Simon Willison’s Showboat for inspiration: [Introducing Showboat and Rodney, so agents can demo what they’ve built](https://simonwillison.net/2026/Feb/10/showboat-and-rodney/)

#### Evaluator agents

Evaluators are agents that evaluate the implementations of other agents. They will remove you as the first evaluator, which will end up saving you time.

This article from Anthropic will explain the concept in more depth: [Harness design for long-running application development
](https://www.anthropic.com/engineering/harness-design-long-running-apps)

#### Validation at scale

Validation at scale basically means validating agentic outputs without reading every single line of code with full focus. Unfortunately, I don’t have an article to share with you here. All I have is some advice:

- Pay attention to the cognitive friction you experience when working with coding agents. This friction can include things like too much noise or not knowing what to do next. Whenever you experience friction, think about how you could make things cognitively easier to handle.
- Think about what the important human-in-the-loop moments are and how you could insert yourself into those moments in an easy way. One way of doing this is through [Human Todos](https://arsctx.com/blog/human-todos/).

## Next steps

This is where my advice ends. But maybe when you’ve completed everything above, you’ll already know what you need to learn next.

If you are wondering how to keep up to date with everything, I have found articles from OpenAI and Anthropic to be extremely well written and to always contain at least some true gems:

- Anthropic: [Engineering at Anthropic: Inside the team building reliable AI systems
](https://www.anthropic.com/engineering)
- OpenAI: [Stories about the technology and builders at OpenAI](https://openai.com/news/engineering/)

The latest prompting hacks you can find on Reddit or X, on the other hand, are often fool’s gold that takes time and attention away from your daily experimentation budget.

When it comes to video, I enjoy watching the more [geeky AI Engineer](https://www.youtube.com/@aiDotEngineer) talks, such as: [
Don't Ship Skills Without Evals — Philipp Schmid, Google DeepMind](https://www.youtube.com/watch?v=0vphxNt4wyk)
