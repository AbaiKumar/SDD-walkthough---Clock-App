<!--
Sync Impact Report
==================
Version change: (none — unfilled scaffold) → 1.0.0
Modified principles:
  - Placeholder principle 1 → I. Semantic HTML
  - Placeholder principle 2 → II. Predictable CSS Architecture
  - Placeholder principle 3 → III. Explicit JavaScript Conventions
  - Placeholder principle 4 → IV. Consistent File and Identifier Naming
  - Placeholder principle 5 → V. Simplicity, Accessibility, and Progressive Enhancement
Added sections:
  - Code Style & Structure
  - Development Workflow & Quality Gates
  - Governance
Removed sections: none (scaffold placeholders only)
Deferred TODOs: none
-->

# Clock Speckit Constitution

## Core Principles

### I. Semantic HTML

HTML MUST describe meaning, not appearance.

- Documents MUST start with `<!DOCTYPE html>` and declare `lang` on `<html>`.
- Structure MUST use semantic elements (`header`, `nav`, `main`, `section`, `article`,
  `aside`, `footer`) before generic `div` or `span` elements.
- Each page MUST contain exactly one `<main>` element and a logical heading order
  (`h1` through `h6`, no skipped levels).
- Interactive controls MUST use native elements (`button`, `a`, `input`, `select`) rather
  than clickable non-interactive elements.
- Every image MUST have an `alt` attribute; decorative images MUST use `alt=""`.
- Form controls MUST have an associated `<label>` or `aria-label`.

Rationale: Semantic markup is the foundation for accessibility, SEO, and maintainable
styling; appearance belongs in CSS.

### II. Predictable CSS Architecture

CSS MUST be organized, scoped, and named so any rule can be located and safely changed.

- Class names MUST follow BEM: `.block`, `.block__element`, `.block--modifier`.
- Class and custom-property names MUST use `kebab-case` (for example,
  `.site-header__logo`, `--color-primary`).
- Styling MUST target classes, not element IDs; ID selectors are prohibited for styling.
- Element selectors MUST be limited to base/reset styles.
- Design tokens (colors, spacing, typography, radii) MUST be declared once as custom
  properties on `:root` and reused.
- `!important` MUST NOT be used except to override third-party styles, with an adjacent
  comment explaining why.
- Inline `style` attributes are prohibited; all styles MUST live in `.css` files.
- One stylesheet per component or concern, imported from a single entry stylesheet.

Rationale: BEM plus tokens prevents selector collisions and makes visual changes
predictable without deep selector chains.

### III. Explicit JavaScript Conventions

JavaScript MUST be readable, modular, and free of hidden global state.

- Code MUST use ES modules (`import`/`export`); global variables are prohibited.
- `const` MUST be the default; `let` is allowed only for reassigned bindings; `var` is
  prohibited.
- Variables, functions, and parameters MUST use `camelCase`.
- Classes and constructor functions MUST use `PascalCase`.
- Module-level constants MUST use `UPPER_SNAKE_CASE`.
- Boolean identifiers MUST start with `is`, `has`, `can`, or `should`.
- Event handlers MUST be named `handle<Event>` (for example, `handleSubmit`).
- DOM references MUST be named with a `$` prefix (for example, `$menuButton`).
- Comparisons MUST use `===` and `!==`; loose equality is prohibited.
- Asynchronous code MUST use `async`/`await` rather than raw promise chains.
- `console.log` MUST NOT remain in committed code; use `console.warn` or
  `console.error` only for actionable diagnostics.
- Inline event handler attributes (`onclick` and similar) are prohibited; listeners
  MUST be registered in JavaScript files.

Rationale: Uniform naming and module boundaries make behavior easy to trace and review.

### IV. Consistent File and Identifier Naming

Every file and identifier MUST be lowercase, descriptive, and consistent across the project.

- File and directory names MUST use `kebab-case` (for example, `main-navigation.js`,
  `button-group.css`, `contact-form.html`).
- File names MUST NOT contain spaces, uppercase letters, or vague terms such as `utils2`,
  `temp`, or `final`.
- Each file MUST have one clear responsibility reflected in its name.
- HTML `id` attributes MUST use `kebab-case` and MUST be unique within a document.
- HTML `id` values MUST be reserved for accessibility relationships, fragment links, and
  form labels; JavaScript hooks MUST use `data-js-*` attributes instead.
- `data-*` attributes MUST use `kebab-case` (for example, `data-js-menu-toggle`).
- CSS custom properties MUST use `--kebab-case`; JavaScript MUST access them with
  `kebabCase` names where applicable.
- Test, mock, and example files, if added later, MUST follow the same `kebab-case`
  convention with a descriptive suffix.

Rationale: Consistent naming removes ambiguity during search, review, and handoff.

### V. Simplicity, Accessibility, and Progressive Enhancement

Solutions MUST be as simple as the requirement allows and MUST work without JavaScript
where practical.

- Vanilla HTML, CSS, and JavaScript MUST be the default; frameworks or build tooling
  require an explicit, documented justification.
- Content and core navigation MUST remain usable when JavaScript fails or is disabled.
- Behavior MUST be added with progressive enhancement: markup first, styling second,
  scripting last.
- Every interactive element MUST be keyboard reachable and MUST show a visible focus
  indicator.
- Color MUST NOT be the only means of conveying information.
- Code MUST avoid unnecessary dependencies; each dependency MUST have a stated purpose.

Rationale: Simplicity lowers maintenance cost, and progressive enhancement guarantees a
usable baseline for every visitor.

## Code Style & Structure

- Indentation MUST use two spaces; tabs are prohibited.
- Lines SHOULD stay under 100 characters; long lines MUST be wrapped readably.
- Files MUST end with a single newline and MUST NOT contain trailing whitespace.
- HTML attributes MUST use double quotes; CSS and JavaScript strings MUST use single
  quotes.
- CSS declarations MUST end with semicolons; JavaScript statements MUST end with
  semicolons.
- Blank lines MUST separate logical blocks; comments MUST explain intent, not restate code.
- Directory layout MUST separate concerns: `index.html` at the root, `css/` for
  stylesheets, `js/` for scripts, and `assets/` for images and fonts.
- HTML, CSS, and JavaScript MUST live in separate files; inline `<style>` and `<script>`
  blocks are prohibited except for documented, page-specific exceptions.
- Third-party code MUST be isolated in a `vendor/` directory and MUST NOT be edited
  directly.

## Development Workflow & Quality Gates

- Automated unit tests are NOT required for this project.
- Every change MUST pass a manual review checklist before merge:
  - Valid HTML structure with no console errors.
  - Responsive behavior verified at mobile, tablet, and desktop widths.
  - Keyboard navigation and visible focus verified.
  - Naming conventions in this constitution verified.
  - No leftover debug statements, commented-out code, or unused files.
- Reviewers MUST reject changes that violate a MUST rule unless a documented exception
  is recorded in the change description.
- New shared patterns MUST be documented in the project README or a linked style guide
  before reuse.

## Governance

This constitution supersedes conflicting local conventions for HTML, CSS, and JavaScript.

- Amendments MUST be proposed in writing, reviewed by at least one maintainer, and merged
  with the updated constitution.
- Versioning follows semantic versioning: MAJOR for incompatible rule removals or
  redefinitions, MINOR for new principles or materially expanded guidance, PATCH for
  clarifications and typo fixes.
- Every change MUST state its version bump and rationale in the commit message.
- Compliance MUST be verified during code review; unresolved violations block merge.
- Exceptions MUST be time-bound, documented in the change description, and removed once
  the underlying constraint no longer applies.
- This constitution MUST be reviewed at least once per major project milestone.

**Version**: 1.0.0 | **Ratified**: 2026-11-10 | **Last Amended**: 2026-11-10
