Documentation for the Terrific module

# *Accordion*


## Summary

Semantically correct and accessible accordion, with some simple configuration options. Supports single and multiple sections which can be open exclusively or independently.

## Need to know

In order to keep things simple and easy to modify this module is not built to be nested. Neither does it include any animations or transitions. If you need those you'll have to build them yourself.

You must to set exclusive values for the `id` attribute on the accordion sections. The "progressive enhancement" JS implementation will fail if you don't set those values correctly. This is by design: The no-js implementation depends on the `id` too and coding the module's model to use the `id`s as keys forces you to set it all up correctly.

The id value uses the following schema: `accordion-{instance_identifier}-{section-identifier}` e.g. `accordion-2-bd-1` or `accordion-prod_details-tech_specs`.

The default behavior of the module is that only one section open at a time. This can be configured by setting a `data-mode` attribute on the module wrapper.

- `data-mode=exclusive` (default) only one section open at a time
- `data-mode=independent` sections open and close independently

## Markup

```html
<section class="mod mod-accordion [data-mode=independent]">
	<section class="section-accordion js-section">
		<h3 class="hd js-hd"><a href="#accordion-1-bd-1">Accordion section title</a></h3>
		<div id="accordion-1-bd-1" class="bd js-bd">
			Body content of accordion section
		</div>
	</section>
	<section class="section-accordion js-section [state-open]">
		<h3 class="hd js-hd"><a href="#accordion-1-bd-2">Accordion section title</a></h3>
		<div id="accordion-1-bd-2" class="bd js-bd">
			Body content of accordion section
		</div>
	</section>
</section>
```

## Dependencies

- terrific-extensions.js
- script that removes .no-js class from HTML element

---

<small>
	Learn about [Markdown](https://help.github.com/articles/github-flavored-markdown) syntax.
<small>
