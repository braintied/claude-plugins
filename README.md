# Braintied plugins for Claude Code

The build-and-design harness we use at [Braintied](https://braintied.com) to take ideas
to live products, packaged so anyone can use it.

## Install

In Claude Code:

```
/plugin marketplace add braintied/claude-plugins
/plugin install braintied@braintied
```

Projects started from [braintied/idea-to-mvp](https://github.com/braintied/idea-to-mvp)
offer to install it automatically when you open them.

## What's in `braintied`

| Skill | What it does |
|---|---|
| `/design` | Six stages from idea to an intentional site: brief, direction, identity, imagery, composition, critique. Every decision is written to `docs/brand/` so later sessions stay on-brand. |
| `/brand-to-tokens` | Applies existing brand colors, fonts and logo as design tokens. |
| `/explain` | Explains any part of your project in plain words, using your own code. |
| `/next` | Suggests the most valuable next thing to build, with a ready prompt. |
| `/review-my-diff` | Reviews your changes for bugs, leaked keys, missing security, broken mobile. |
| `/ship-it` | Review, check, commit, push, confirm the live site. |
| `/learn` | Shows your [Braintied Academy](https://braintied.com/academy) progress and logs milestones (design direction, first deploy...) as you hit them. Optional: sign in once with `npx @braintied/academy login`; without it, it stays quiet. |

`/design` stage 4 generates images with OpenAI's newest GPT Image model and needs
`OPENAI_API_KEY` in your project's `.env.local`.

Update with `/plugin update braintied@braintied`; improvements land for everyone.

## License

Free to use in your own projects. See [LICENSE](LICENSE).
