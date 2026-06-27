# Skill Registry

This registry tracks the available specialized skills for agent tasks. Each skill has a description/trigger condition and a source file. Before executing tasks that match these areas, phase agents must read the respective `SKILL.md`.

## Available Skills

- **a11y-debugging**
  - Trigger: Uses Chrome DevTools MCP for accessibility (a11y) debugging and auditing based on web.dev guidelines. Use when testing semantic HTML, ARIA labels, focus states, keyboard navigation, tap targets, and color contrast.
  - Path: `/home/devcool/.gemini/config/plugins/chrome-devtools-plugin/skills/a11y-debugging/SKILL.md`

- **chrome-devtools**
  - Trigger: Uses Chrome DevTools via MCP for efficient debugging, troubleshooting and browser automation. Use when debugging web pages, automating browser interactions, analyzing performance, or inspecting network requests.
  - Path: `/home/devcool/.gemini/config/plugins/chrome-devtools-plugin/skills/chrome-devtools/SKILL.md`

- **chrome-extensions**
  - Trigger: Build and publish Chrome Extensions using Manifest V3 best practices. Trigger on mentions of: 'Chrome extension', 'browser extension', 'manifest.json', 'content script', etc.
  - Path: `/home/devcool/.gemini/config/plugins/modern-web-guidance-plugin/skills/chrome-extensions/SKILL.md`

- **debug-optimize-lcp**
  - Trigger: Guides debugging and optimizing Largest Contentful Paint (LCP) using Chrome DevTools MCP tools.
  - Path: `/home/devcool/.gemini/config/plugins/chrome-devtools-plugin/skills/debug-optimize-lcp/SKILL.md`

- **google-antigravity-sdk**
  - Trigger: Design, implement, and debug autonomous AI agents and multi-agent systems using the Google Antigravity (AGY) SDK.
  - Path: `/home/devcool/.gemini/config/plugins/google-antigravity-sdk/skills/google-antigravity-sdk/SKILL.md`

- **memory-leak-debugging**
  - Trigger: Diagnoses and resolves memory leaks in JavaScript/Node.js applications. Use when a user reports high memory usage, OOM errors, or wants to analyze heapsnapshots.
  - Path: `/home/devcool/.gemini/config/plugins/chrome-devtools-plugin/skills/memory-leak-debugging/SKILL.md`

- **modern-web-guidance**
  - Trigger: Search tool for modern web development best practices. MANDATORY: Execute FIRST for all HTML/CSS and clientside JS tasks.
  - Path: `/home/devcool/.gemini/config/plugins/modern-web-guidance-plugin/skills/modern-web-guidance/SKILL.md`

- **troubleshooting**
  - Trigger: Uses Chrome DevTools MCP and documentation to troubleshoot connection and target issues. Trigger this skill when list_pages, new_page, or navigate_page fail.
  - Path: `/home/devcool/.gemini/config/plugins/chrome-devtools-plugin/skills/troubleshooting/SKILL.md`
