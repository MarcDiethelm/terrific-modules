terrific-modules
================

Reusable Terrific.js modules.

## Brainstorm

- Structure of modules is as in classic Terrific (so it's usable as a simple download). (conservative use)
- Normal use: `terrific` CLI tool allows automated and customized module "installs"
	- `terrific install accordion --layout xtc`
	- config file to persist options for a target project
- This project needs to be versioned, because there will be some framework-like interdependencies
- Modules include tests (using a js-based runner)
- Modules may include Readme.md (using a js-based runner)
- Implement a overview page/site
- Implement mini site/server (node.js) so overview can be run/displayed locally.

## Dependencies

- terrific-extensions.js
- IE 8 and lower require [Selectivizr.js](http://selectivizr.com/) a CSS3 selectors polyfill.
