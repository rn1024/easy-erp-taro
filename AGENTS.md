# Repository Guidelines

## Project Structure & Module Organization
- Source lives in `src/`, with `app.tsx` handling global config and `app.scss` exposing shared tokens.
- Pages sit in `src/pages/<feature>` beside scoped `.scss`; shared UI goes in `src/components`, reusable logic in `src/hooks` or `src/stores`.
- HTTP helpers belong to `src/services` and `src/utils` while static media is stored under `src/assets`.
- Mirror ERP integration contracts in top-level `services/`; update them whenever upstream agreements shift.
- Environment configs stay in `config/`; generated bundles (`dist/`) remain untracked.

## Build, Test, and Development Commands
- `pnpm install` – resolve dependencies.
- `pnpm dev:weapp` – watch-mode build for the WeChat mini-program (swap suffix for other targets).
- `pnpm build:weapp` – generate a production bundle for the same target.
- `pnpm lint` / `pnpm lint:fix` – inspect or auto-fix lint issues across `src/`.

## Coding Style & Naming Conventions
- Prefer TypeScript React function components with two-space indentation and no trailing semicolons.
- Name components in `PascalCase`, hooks and stores in `camelCase`, and page files using kebab-case.
- Reference local modules via the `@/` alias; SCSS should follow the existing BEM-like selectors (e.g., `.index-page__stat-item`).

## Testing Guidelines
- Add feature tests as `*.spec.tsx` beside the implementation and run them with the Taro testing CLI.
- Stub network boundaries when testing services; cover new integrations before merging.
- Log manual smoke checks for the affected platform (e.g., “Weapp inventory flow”) in PR notes until automated CI arrives.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `refactor:`) with concise English or Chinese summaries.
- Each PR should outline the problem, link issues, attach relevant UI proofs, and note progress through the 6A checklist.
- Confirm `pnpm lint` and `pnpm build:<target>` succeed locally; flag any `config/` or service contract changes.

## Agent Workflow Highlights
- Align scope and record requirements before editing.
- Architect component structure, navigation, and API impacts ahead of implementation.
- Atomize work into granular commits or checklists; seek Approval before merging.
- Automate lint/build runs when scripts shift, and Assess outcomes via acceptance criteria plus smoke tests.
