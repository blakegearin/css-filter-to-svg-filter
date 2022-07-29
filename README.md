# CSS Filter to SVG Filter

## Getting Started

Install: `$ npm install css-filter-to-svg-filter`

Import: `import CSSFilterToSVGFilter from 'css-filter-to-svg-filter';`

## Usage

### Constructor - `new CSSFilterToSVGFilter()`

Use to start the conversion.

```javascript
const cssFilter = 'filter: invert(50%);';
const converter = new CSSFilterToSVGFilter(cssFilter);

// With optional parameters
const params = {
  filterId: 'greatId',
  includeBlur: true,
  includeDropShadow: true,
};
const customConverter = new CSSFilterToSVGFilter(cssFilter, params);
```

**Required parameters:**

- `cssFilter`, see [CSS Filter section](#css-filter) for more details

**Optional parameters:**

|Name               |Default|
|-------------------|-------|
|`filterID`         |none   |
|`includeBlur`      |`false`|
|`includeDropShadow`|`false`|

### Generate SVG File - `toSVG()`

Use to convert and generate a string of an SVG containing a single filter.

```javascript
const cssFilter = 'filter: invert(50%);';
const svg = new CSSFilterToSVGFilter(cssFilter).toSVG();

console.log(svg);
// <svg width="100%" height="100%"><filter color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="table" tableValues="0.5 0.5"/><feFuncG type="table" tableValues="0.5 0.5"/><feFuncB type="table" tableValues="0.5 0.5"/></feComponentTransfer></filter></svg>

// With optional parameter
const filterId = 'greatId';
const customSVG = new CSSFilterToSVGFilter(cssFilter).toSVG({filterId});

console.log(customSVG);
// <svg width="100%" height="100%"><filter id="greatId" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="table" tableValues="0.5 0.5"/><feFuncG type="table" tableValues="0.5 0.5"/><feFuncB type="table" tableValues="0.5 0.5"/></feComponentTransfer></filter></svg>
```

**Required parameters:** none

**Optional parameters:**

|Name                |Default                     |
|--------------------|----------------------------|
|`attributes`        |`width="100%" height="100%"`|
|`svgFilter`         |`this.toSVGFilter()`        |

### Generate SVG Filter - `toSVGFilter()`

Use to convert and generate a string of an SVG filter.

```javascript
const cssFilter = 'filter: invert(50%);';
const svgFilter = new CSSFilterToSVGFilter(cssFilter).toSVGFilter();

console.log(svgFilter);
// <filter color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="table" tableValues="0.5 0.5"/><feFuncG type="table" tableValues="0.5 0.5"/><feFuncB type="table" tableValues="0.5 0.5"/></feComponentTransfer></filter>

// With optional parameter
const filterId = 'greatId';
const customSVGFilter = new CSSFilterToSVGFilter(cssFilter).toSVGFilter({filterId});

console.log(customSVGFilter);
// <filter id="greatId" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="table" tableValues="0.5 0.5"/><feFuncG type="table" tableValues="0.5 0.5"/><feFuncB type="table" tableValues="0.5 0.5"/></feComponentTransfer></filter>
```

**Required parameters:** none

**Optional parameters:**

|Name                |Default                                  |
|--------------------|-----------------------------------------|
|`filterId`          |none                                     |
|`attributes`        |`color-interpolation-filters="sRGB"`     |
|`svgFilterFunctions`|`Object.values(this.toSVGFilterObject())`|

### Generate SVG Filter Object - `toSVGFilterObject()`

Use to convert and generate an SVG filter as an object.

```javascript
const cssFilter = 'filter: invert(50%);';
const svgFilterObject = new CSSFilterToSVGFilter(cssFilter).toSVGFilterObject();

console.log(svgFilterObject);
// { invert: '<feComponentTransfer><feFuncR type="table" tableValues="0.5 0.5"/><feFuncG type="table" tableValues="0.5 0.5"/><feFuncB type="table" tableValues="0.5 0.5"/></feComponentTransfer>' }
```

**Required parameters:** none

**Optional parameters:**

|Name             |Default                   |
|-----------------|--------------------------|
|`cssFilterObject`|`this.toCSSFilterObject()`|

### Generate CSS Filter Object - `toCSSFilterObject()`

Use to convert CSS filter to an object.

```javascript
const cssFilter = 'filter: invert(50%);';
const cssFilterObject = new CSSFilterToSVGFilter(cssFilter).toCSSFilterObject();

console.log(cssFilterObject);
// { invert: { original: '50%', processed: 0.5 } }
```

**Required parameters:** none

**Optional parameters:** none

### SVG Filter Templates - `SVG_FILTER_TEMPLATES`

A static object containing the generalized SVG filters.

```javascript
const svgFilterTemplates = CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES;
```

### CSS Filter

|Filter Functions|Supported|
|----------------|:-------:|
|`brightness`    |✅       |
|`blur`          |❌       |
|`contrast`      |✅       |
|`drop-shadow`   |❌       |
|`grayscale`     |✅       |
|`hue-rotate`    |✅       |
|`invert`        |✅       |
|`opacity`       |✅       |
|`saturate`      |✅       |
|`sepia`         |✅       |

#### Why no `blur` and `drop-shadow`?

These don't have first-class support because the SVG filter function templates require several inputs, some of which do not line up directly between CSS and SVG. The SVG filter function templates for these are still included in `SVG_FILTER_TEMPLATES` for convenience.

By default these will be excluded, but the exclusion can be disabled by using the optional parameters `includeBlur` and `includeDropShadow`. Though please keep in mind they will be included without value replacement (e.g. `[radius]`). Unless values like this are replaced, the filter won't function properly.

## Links/Resources

- [CSS filter property](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
- [SVG filter element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter)
- [SVG filter templates](https://www.w3.org/TR/filter-effects-1/#FilterPrimitiveRepresentation)

## License

[MIT](LICENSE)
