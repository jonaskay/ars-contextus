---
title: Harness as Dependency, and the messy workspaces of harness engineers
description: A practical exploration of managing reusable “harnesses” across local and cloud environments — and why we still lack good patterns for doing it well.
headerGradient:
  light: "from-emerald-100 via-blue-100 to-emerald-100"
  dark: "dark:from-emerald-900 dark:via-blue-900 dark:to-emerald-900"
publishedDate: 2026-03-22
---

**Before we get started:** I use the term *harness* multiple times in this post. In this context, by harness I mean all the constitution files, skills, agent definitions, and other things you use to configure the behavior and context of your coding agent.

## The case for liftable harnesses

In my latest AI-first experiment, I’ve been using a combination of Claude Code and GitHub Copilot Agent. I have a great local workflow that’s working for me and that’s built for a Claude Code agent running in a container. Every now and then, I give some easier tasks to the GitHub Copilot Agent to run in the cloud. I’m using the Copilot Agent more and more through my GitHub mobile app, as I’ve switched from writing improvement ideas on the go in my note-taking app to immediately prompting the Copilot Agent to try to implement the idea.

I have encountered some friction with this way of working: all of my harness (`CLAUDE.md`, skills, hooks, and other things) has been built for my containerized Claude Code setup. My GitHub Copilot Agent is trying to solve issues with barely any assistance. I’m using it so often now that I should really do something about this.

Except I don’t want to! Going through GitHub’s documentation for agent configurations is not something that interests me that much. And I’m already dreading the idea of having to figure out a setup that works for both Claude Code and GitHub Copilot Agent, and doesn’t involve copy-pasting markdown files between folders and doing manual test runs to make sure everything is read properly.

I also don’t want GitHub Copilot Agent to automatically adopt my full Claude Code harness. My harness contains assets that are built for my local, containerized workflows. These include step-by-step instructions on creating pull requests. I don’t want GitHub Copilot Agent to follow these instructions for a few reasons:

1. Those instructions are tied to the local environment. GitHub Copilot Agent operates in a different environment. Some of the steps simply make no sense.
2. I don’t use GitHub Copilot Agent for feature development but for chores. I expect different things from pull requests from a feature-development agent than from a chore agent.
3. GitHub Copilot Agent seems very much optimized for certain types of issue and pull request behaviors. I’m worried that my specific instructions will mess something up in the outputs.

On top of all that, I’m hoping to build app-specific evals as an experiment at some point. I sat down to sketch what this could look like in practice and realized that if I wanted to do easy A/B testing with two harness setups, I would need a harness that I can easily switch with another one. Easy switching means I can both lift off and lift in harness setups from my application under test.

## Problem with spaghetti harnesses

My current harness is very far from “liftable.” I don’t have one Git-ignored directory that contains everything. Instead, I have different types of Git-committed assets sprinkled all over the repository: bash scripts for agentic workflows next to general-purpose bash scripts, docs written only for agents, and linter rules that are in place to prevent bad agent behavior.

I can get by with this approach of baking everything in together with the rest of the project. I’m the only one working on the project, and I’m doing agent-only coding (I don’t write code in the project). But what if someone were to join this project and they were using Codex instead of Claude Code? Or Claude Code, but in a very different way than I do (e.g., using agent teams instead of bash scripts to facilitate workflows)? Or what if they didn’t want to use any agents at all and instead wanted to write their own code from start to finish? The messiness of my harness would start to show very quickly.

## Drafting a solution

We are missing patterns for setting up harnesses that can be swapped in and out as needed. Let me share what my current ideal development experience looks like with heavy agent usage:

* I need a local workspace that’s optimized for agent-only work. I say local because I want a setup where I can always easily jump in to fine-tune the harness when the agent messes something up.
* I need a local workspace that’s optimized for me and an assisting agent. Here I want zero friction that prevents me from entering a good flow state.
* I need a cloud workspace that’s optimized for an agent to handle chore tasks for me in the background.

I can see all of those workspaces having different instructions for agents. This means that if I Git-commit a bunch of markdown files into my code repository, those files can easily end up bloating the context of all of my agents, no matter which workspace they operate in. Obviously, I don’t want to have three repositories for the same app either.

A cleaner way would be to have some kind of harness installation step that sets up the right harness in the right workspace. The inputs would live in Git, but not the outputs that stay local to the workspace.

This approach enables another cool pattern: compressed instructions and skills. This is something I first encountered in [Vercel’s post about AGENTS.md versus skills](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals). Why spend tokens on things like whitespace or other elements needed for human readers? Why not keep an uncompressed, non-serialized version of your instructions separate from what you serve to the agents? Write and edit the files in one place, and then have your agent read them from another.

But where should your uncompressed AGENTS.md files live? Probably not inside your codebase—unless you want agents to accidentally read the same instructions twice.

A completely separate repo is one way to avoid this confusion. But now there’s a wall between our codebase and our harness, and we cannot reference our harness files with simple file paths. We might end up with configuration files called, for example, `harness.claude.yaml` and `harness.copilot.yaml`. As an example, the latter could look something like this:

```yaml
provider: copilot
source: https://github.com/acme/acme-harness
constitution:
  - cloud-development
agents:
  - reviewer
skills:
  - playwright-skill
hooks:
  - copilot-hooks.json
scripts:
  - test.sh
linters:
  - eslint.agent.config.js
```

This is all pseudo-config and purely a sketch of the configuration experience I would like to have. `provider` contains the required information to build the assets in a way that’s readable by GitHub Copilot. `source` is where my harness assets live. `constitution` is your `AGENTS.md` or `CLAUDE.md` file. `agents` are the sub-agent definitions. `skills` are the skill definitions. `hooks` are the agent lifecycle automations. `scripts` are helper scripts for agents that ensure certain actions are performed in a specific way. Finally, `linters` contains linter configurations that are specific to agents.

This configuration file needs to be read by some piece of software that can retrieve the assets and knows how to build them for the chosen provider.

## Complexities of dependency management

Do we need versioning for our harness? If it’s just me and my harnesses, I’m happy using the latest version available. If I’m working in a team setting, I might want to choose whether I want the latest version or one that I know works for me. This is where this approach starts to feel like a mistake. Why? Versioning adds more complexity to the tooling, and complexity makes it harder to fine-tune our harnesses (which we need to do all the time in harness engineering).

And what about authentication? If the assets live in a separate private repository, we need to manage authentication tokens that allow us to fetch the required assets when building our harness.

Maybe all this tooling complexity won’t be worth the benefits. After all, hours spent configuring tools are hours away from other work. Simpler setups make it easier for others to engage in harness engineering as well. It’s much more fun to start by creating a new local markdown file than by first reading a manual on how to configure, manage, and build your harness.

This is really a whole new category of tooling. You might have encountered `.vscode/settings.json`, which enforces helpful settings for VS Code users working with a codebase. Are teams trying to make that configuration file readable by all IDEs and editors? No. Do we have different linter rules depending on which developer is committing code? No. But for agent harnesses, we seem to need both reusability and configurability in a way we haven’t needed before when defining tooling for development workspaces.

Companies that use a single coding agent don’t really need to worry about this. But are those companies approaching AI-first development the right way? The landscape is changing so fast that picking a single tool this early seems extremely risky. It might also be that even when things settle, developers will prefer environments where they can choose their coding agent instead of having it chosen for them.

---

### Additional notes

* We could have easy versioning by referring to Git commits on main. The idea here is that the harness is still meant for a single codebase, and the workspace is the changing variable. We don’t need to publish our harness for the whole world to use.
* If I see my harness failing and want to try a fix, I don’t want to make the change in another repository, run a build, and try again. I want to experiment directly in my current workspace. If it works, I could run a command that checks my changes against the Git-committed harness assets and applies them to the harness repository.
* Can we have Backstage, but for agents? A place where harnesses live. I could browse an internal catalog of skills and install them from there with a single click of a button.
