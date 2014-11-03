Documentation for the Terrific module

# *media-event*


## Summary

Media query "events" for JS, based on Terrific connectors.  
For an example how to consume the events see [Media-Event-Consumer](https://github.com/MarcDiethelm/terrific-modules/tree/develop/modules/Media-Event-Consumer) module, which implements dynamic loading of images based on the media queries.

## Need to know

Depends on Enquire.js and for older browsers a matchMedia/matchMedia.addListener polyfill. Both are already present in `lib/`.

This JS-only module must be registered with code in the Terrific bootstrap.
`
app.registerModule($body, 'MediaEvent');
`

The connector callback `onViewportChange` receives a simple data object containing two properties:
- `query` {Object}
    - `query.name` contains the viewport name
    - `query.string` the matched media query.
- `state` {'match'|'setup'} -  _setup_ is sent for first matches only, _match_ for first and subsequent matches.

## Dependencies

- [Enquire.js](http://wicky.nillia.ms/enquire.js/)
- [matchMedia polyfill](https://github.com/paulirish/matchMedia.js) ([optional](http://caniuse.com/#feat=matchmedia))
- [matchMedia.addListener polyfill](https://github.com/paulirish/matchMedia.js) ([optional](http://caniuse.com/#feat=matchmedia))

---

<small>
	Learn about [Markdown](https://help.github.com/articles/github-flavored-markdown) syntax.
<small>
