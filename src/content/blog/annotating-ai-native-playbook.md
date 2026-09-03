---
title: Annotations for Anthropic’s AI-Native SDLC Playbook
description: "A critical look at Anthropic’s AI-Native SDLC Playbook: what works, what doesn’t, and where its advice on agents, design, evals, and reviews falls short."
headerGradient:
  light: "from-rose-200 to-slate-200"
  dark: "dark:from-rose-900 dark:to-slate-900"
publishedDate: 2026-09-03
---

Anthropic has released [The AI-Native SDLC Playbook](https://claude.com/blog/the-ai-native-sdlc-playbook) to *“transform your software development lifecycle with AI.”*

I had a conversation with someone who had taken their coding agent, pointed it to the playbook, and then asked how far their setup was from Anthropic’s recommendations. I love this approach. But is the playbook a reliable guide? There’s plenty of good stuff, things that seem misleading, and at least one set of steps that seems completely impossible. These are my annotations for the playbook.

## “Code is no longer the bottleneck”
Code tends to be the bottleneck for rewrite projects, first releases, and projects that have collected so much technical debt that velocity has ground to a halt. Those are the situations where you have large amounts of spec that need to be turned into code before you can start generating value. With existing software, the bottleneck is most of the time learning: if your design strategy is “more is more,” then good luck delivering experiences that your users will enjoy.
You might still feel that velocity is your bottleneck even though you are not working on a rewrite, a first release, or a project with massive amounts of tech debt. In this case, you are most likely a [“feature team”](https://www.svpg.com/product-vs-feature-teams/) where the product owner acts as a backlog administrator and success is measured by output.

If you are a team that focuses on outcomes, then your bottleneck has most likely been planning, design, and learning for a long time. In those settings, developers not delivering fast enough is a problem only when you are working toward some time-sensitive milestone.

If you are a feature team that wants to become this type of a "product team," you are facing an organizational problem, not an AI adoption problem. But the sad reality is that organizational solutions are often outside a team’s sphere of influence. Your product owner will have a much more enjoyable work day if they keep the business stakeholders happy by delivering stuff faster for them.

Anthropic’s AI-Native SDLC Playbook provides steps for achieving this output velocity, as code is indeed becoming less and less of a bottleneck for teams that just want more story points done per sprint.

**Verdict:** This playbook feels like a step back for modern product management.

## Traditional SDLC versus AI-Native SDLC
The playbook describes traditional SDLC through the following steps:

1. **Plan:** "Requirements gathered by committee, distilled through workshops and sign-offs, written up by hand"
2. **Design:** "Spec written by analysts, parsed by designers"
3. **Build:** "Tests and code are handwritten and documentation is written after the main development happens"
4. **Test:** "QA gates at stage boundaries"
5. **Deploy:** "Humans review every line of code and governance occurs in review cycles, often inconsistently"
6. **Maintain:** "Humans watch production for bugs"

Even before coding agents, many of these steps were anything but modern. Gathering requirements by committee, having analysts write specs for designers, and having humans watch production for bugs are anti-patterns. These were signs of poor product, design, and technical skills.

**Verdict:** If you recognize yourself in the planning, design, and maintenance steps, you most likely have a capabilities problem, not a velocity problem that can be solved by agents.

## Plan
The playbook instructs everyone to write down their ideas together with Claude and save them as `intent.md` files. This file is then reviewed and modified by the product owner and committed to the codebase.

Writing down ideas and sharing them with others is a great practice. I believe that agents can help people in this process and that people with good product sense will get a lot of mileage out of agents once they start learning how to interact with them in a conversational way.

I believe that if the `intent.md` files become unbearable for the product owner to read, it’s possible to tweak the agent skills used to write those ideas. Limiting `intent.md` to a single A4 page is probably a good start.

**Verdict:** Receiving ideas through `intent.md` files is something I would personally prefer as a product owner.

## Design
Designers are not needed in this new AI-native way of doing things according to the playbook. Maybe there are some somewhere in the background, still drawing occasional Figma mockups for agents to validate their designs against. But they don't seem to take part in the Plan and Design steps. Is this a problem?

[Anthropic still has designers, and these designers work on designs before and after implementation](https://youtu.be/eh8bcBIAAFo). To me, that seems like enough proof that current agents are not able to replace designers, even if the only thing you want to automate is pixel-perfecting. Trying to automate user research and interface design seems like something that will be even harder to do.

**Verdict:** If you want to keep your designer on your team, then this playbook might fall completely apart in the plan and design steps. Lifting these patterns for your team might not work at all.

## Build
The product owner generates a `spec.md` file from `intent.md` to follow a type of multi-person, spec-driven development approach. This approach leaves a lot to be desired.

The two critical parts of generating a spec for engineers are scoping the solution and defining the user journeys. By scoping the solution, I mean identifying the rabbit holes that need to be thought through if you want a valuable implementation from an engineer. By defining the user journeys, I mean describing the overall flow of things and then making the balancing decisions between the fastest possible flow and the most understandable flow.

But this is fixable by expanding Anthropic’s example prompts into something less naive.

What’s not fixable is communicating a spec through documents alone. You will end up with a lot of rework and wonky features if the engineers don’t get a good grasp of the thing you want to put out into the world. You can document all you want, but drawing lines and writing things down while explaining something to someone in person or over video is still a critical part of building shared understanding.

Some additional nitpicks about the advice:

* Do not run `/init` to have an agent generate the `CLAUDE.md` file for you. Only add things to it when needed.
* Do not just keep adding skills. Skills don’t scale even with progressive disclosure, [according to Anthropic’s own engineers](https://youtu.be/tuY2ChJIx48).

But there’s some really valuable stuff as well:

* Do start with planning before asking the agent to implement the feature.
* Do use worktrees so that you always have the option to easily jump into another task while another agent is working on something else.
* Do use verifier and evaluator agents to review implementations before you start reading the lines of code.

**Verdict:** There are both gems and misses among the productivity tips. Communicating specs only through Markdown files within your team is an anti-pattern.

## Test
Here I will focus on the biggest WTF moment I had with the playbook: **Continuous evals in CI**. The described setup is nonsensical.
These are the first two steps from the playbook:


> 1. The platform engineer collects 20–50 real tasks from recent work, along with their expected/accepted outcomes.
> 2. Write each task as an eval, meaning the prompt plus the checks that define what is acceptable (tests pass, lint is clean, behavior is unchanged, policy is followed).”

How can you generate an eval for a task that has already been completed?

You can’t point the agent to a codebase and ask it to reimplement something that’s already there. The agent will see your task (e.g., "Add a DELETE endpoint for Books"), see that the endpoint already exists, and then correctly respond, "The endpoint already exists."

What you could do is go back in Git history to a point before the implementation, which is what SWE-bench does. But then you’ll run into the next problem: you’re committing your `CLAUDE.md`, skills, and other harness files as well. When you go back in Git history, you’re also going back to an earlier version of your harness, which makes it impossible to test your harness changes.

At least to me, it seems like the only way to get any of this working is to move your harness into a plugin that you store in a Git repo. But none of this is mentioned in the article. Claude plugins cannot edit `CLAUDE.md` files either, which is another indicator that something is missing from the writing.

Other than that, providing feedback loops for agents is critical for more consistent results. However, you will likely need to introduce a human-in-the-loop for test generation, as agents tend to write lots of low-value tests, especially in the integration layer, which will end up hurting you in the long run.

**Verdict:** Follow the advice about feedback loops. Continuous evals seem to be missing some critical information needed to make them something you can actually implement.

## Deploy
I truly wish that coding agents would free me from the toil of PR reviews, but I struggle to find teams that are actually able to replace reviews with things like `REVIEW.md` files.

Also, [the larger the context in your PR for an agent to review, the more likely it is to miss things](https://arxiv.org/abs/2605.12366). And by following this playbook, you are not breaking things into smaller batches but instead delivering more things in one go.

The much more useful review helpers missing from the playbook are those that surface important information for human reviewers. This will help them trash junk PRs immediately and know when to pay closer attention to the proposed changes. This can be done by cleaning up noisy nitpicks from agents (why even show them to humans when agents can fix those themselves?), providing feature walkthroughs in PRs, and communicating the blast radius.

What the playbook does suggest to ease reviews is adding guardrails through hooks for different file edits (e.g., no edits to infra files unless changes are requested with a ticket). This is a great pattern but a limited tool for handling PR overflow.

**Verdict:** Overly optimistic about the current capabilities of agents and models.

## Maintenance
Scheduled scripts for catching anomalies in things like post-deployment 5xx rates that trigger Claude runs for diagnosis are engineering at its finest. This will help you sleep better at night as an engineer, even though agents might rarely be able to identify the root causes (these types of tasks seem generally very hard for agents).

Automated PRs from bug tickets are something I feel every team should aim for. Bugs tend to be easy to communicate, involve a limited amount of code changes, and are easy to verify with automated tests.

Having agents sniff out tech debt and bad style asynchronously as background jobs seems like a great way to manage the increasing complexity that agents (and humans) will generate in your codebase if you relax human supervision. This stuff should be done without human prompts, and you should let the agents report issues and propose fixes themselves.

**Verdict:** Great goals for all teams.

## Final thoughts
Anthropic’s AI-Native SDLC playbook is clearly meant to showcase Claude’s features and capabilities. However, it contains some great advice and covers tons of ground. In general, the playbook can give someone a good sense of what true AI-native SDLC smells and tastes like.

But the playbook is also built on a foundation that assumes output is more important than outcome and that you can replace human design skills with agentic skills. If all you want is more features, then here’s your playbook. Otherwise, pick the tips and tricks that work for you and leave the rest for others.

The playbook also doesn’t touch at all on how all of this tooling and harness engineering should be done at a more detailed level (quality harness engineering doesn’t happen by itself). Prepare to learn a lot before you arrive at implementations that your product, design, or engineering will love. Because of this, you need to augment this playbook with additional resources and good taste.

In addition, starting AI-native with a new codebase is easy. [Applying all of the suggestions to existing codebases will be much harder and involves lot of tech debt related work](https://migration.minimumcd.org/docs/agentic-cd/getting-started/repo-readiness/).

Finally, change management is hard as well. Even though there has been broad consensus on what good CI/CD looks like for a good while, many engineering organizations haven’t been able to reach those levels. Why is that?

It seems that it’s not enough to list all the things that you aren’t doing right and then hand the to-dos to someone else. You probably need to do a lot of rethinking of existing structures, roles and responsibilities as well. And I can tell you this from visiting many teams in the past year: we are all still figuring this stuff out.
