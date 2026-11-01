# OpenRig Sidecar Development Culture & Engineering Protocol

All engineers and QA agents operating on `sidecar-dev` must strictly follow this engineering protocol:

## 1. Isolated Git Worktrees First (MANDATORY)
- **Never develop directly on `main` or the primary repository root.**
- When starting any task, feature, UI component, or fix:
  1. Create an isolated worktree under `.worktrees/<branch-name>`:
     ```bash
     git worktree add .worktrees/<branch-name> -b <branch-name>
     ```
  2. Perform all edits, builds, and test runs strictly within that isolated worktree directory.
  3. Ensure `.worktrees/` is ignored in `.gitignore`.
  4. When work is merged or completed, clean up with `git worktree remove .worktrees/<branch-name>`.

## 2. Local Test Execution & Verification First (NO EXCEPTIONS)
- **Zero broken builds, zero unverified commits.**
- Before proposing or pushing code, run the full local verification suite inside the worktree:
  - TypeScript compilation: `npm run build` or `npx tsc --noEmit` (must compile with 0 errors)
  - Native Node 22 test suite: `npm test` (all test cases must pass 100%)
- Adhere strictly to the Antigravity 2.0 Obsidian aesthetic (`#121212` matte dark background, hairline borders, muted accents, crisp typography).
- Preserve zero external runtime dependencies (pure Node 22 native build).

## 3. Submit Pull Requests via GitHub CLI
- **All changes must be delivered via GitHub Pull Requests.**
- Commit using Conventional Commits (`feat(sidecar):`, `fix(sidecar):`, `docs:`, `test:`).
- Push the feature branch to origin:
  ```bash
  git push -u origin <branch-name>
  ```
- Create the Pull Request using GitHub CLI:
  ```bash
  gh pr create --title "<type>(sidecar): <concise summary>" --body "<Summary of features, screenshots/visual notes, and local test verification output>"
  ```
- Notify `qa.reviewer` with the PR link and test instructions.

## 4. Peer Review & QA Handoff
- `core.lead` defines feature requirements and coordinates deliverables.
- `core.builder` creates the isolated worktree, builds the feature, tests locally, and opens the PR.
- `qa.reviewer` validates the PR branch in an isolated worktree, runs the verification suite, confirms UI behavior, and issues the approval.

## 5. Surface Problems First, Radical Honesty & "Right Agent for the Right Work"
- **Surface Problems First & Be Honest**: Never hide, paper over, or silently work around a blocker, broken test, auth/permission barrier, or unclear requirement. Report problems immediately and plainly with concrete evidence (what failed, why it failed, and what options exist).
- **Motto — "Right Agent for the Right Work"**:
  - Do not force an agent seat to improvise outside its domain, tools, or skills.
  - If a seat is not equipped to handle a task cleanly, stop and escalate to `core.lead` (and `advisor-lead@kernel` / `human@kernel`): **propose adding a specific new skill** (`SKILL.md` / plugin) or **propose adding a new specialist seat/pod** to the rig.

## 6. Web Development Standard: Strictly No Emojis in Web UI
- **Never use Unicode emojis in the Sidecar web application UI (`src/html.ts`)**:
  - Unicode emojis render inconsistently across OSes, often turn into `□` tofu boxes on Linux/WSL, and violate the Antigravity 2.0 Obsidian design system.
  - Always use crisp **inline `<svg>` icons** or clean typographic/CSS indicators instead of Unicode emojis.
  - `qa.reviewer` must reject (`NEEDS_REVISION`) any UI changes that introduce Unicode emojis.

## 7. Local Runtime Deployment & Tailscale Binding
- `rig sidecar` serves compiled assets from `~/.openrig/runtime/openrig-sidecar/dist/`, not directly from this repository checkout.
- After a PR is merged to `main` and verified (`npm run build && npm test`), sync and restart bound to `0.0.0.0` so both localhost and Tailscale (`http://xsaw-wsl:7434/`) stay live:
  ```bash
  cp -r dist/* ~/.openrig/runtime/openrig-sidecar/dist/
  cp package.json ~/.openrig/runtime/openrig-sidecar/package.json
  rig sidecar stop || true
  rig sidecar -h 0.0.0.0 --no-open
  ```
