# CSS Filter to SVG Filter

## Getting Started

Install: `$ npm install css-filter-to-svg-filter`

Import: `import CSSFilterToSVGFilter from 'css-filter-to-svg-filter';`

## Usage

- [Constructor](#constructor)
- [Generate SVG File](#generate-svg-file)
- [Generate SVG Filter](#generate-svg-filter)
- [Generate SVG Filter Object](#generate-svg-filter-object)
- [Generate CSS Filter Object](#generate-css-filter-object)
- [SVG Filter Templates](#svg-filter-templates)
- [CSS Filter Support](#css-filter-support)

### Constructor

Use the constructor method `new CSSFilterToSVGFilter()` to start the conversion.

```javascript
const cssFilter = 'filter: invert(50%);';
const converter = new CSSFilterToSVGFilter(cssFilter);

// With an optional parameter
const params = {
  filterId: 'greatId',
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

### Generate SVG File

Use the `toSVG()` method to convert and generate a string of an SVG containing a single filter.

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

### Generate SVG Filter

Use the `toSVGFilter()` method to convert and generate a string of an SVG filter.

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

### Generate SVG Filter Object

Use the `toSVGFilterObject()` method to convert and generate an SVG filter as an object.

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

### Generate CSS Filter Object

Use the `toCSSFilterObject()` method to convert CSS filter to an object.

```javascript
const cssFilter = 'filter: invert(50%);';
const cssFilterObject = new CSSFilterToSVGFilter(cssFilter).toCSSFilterObject();

console.log(cssFilterObject);
// { invert: { original: '50%', processed: 0.5 } }
```

**Required parameters:** none

**Optional parameters:** none

### SVG Filter Templates

Use the static property `SVG_FILTER_TEMPLATES` to view the generalized SVG filters.

```javascript
const svgFilterTemplates = CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES;

const invertSVGFilterTemplate = CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES['invert']['template'];
console.log(invertSVGFilterTemplate);
// <feComponentTransfer><feFuncR type="table" tableValues="[amount] [1 - amount]"/><feFuncG type="table" tableValues="[amount] [1 - amount]"/><feFuncB type="table" tableValues="[amount] [1 - amount]"/></feComponentTransfer>'
```

### CSS Filter Support

|Filter Functions|Supported|
|----------------|:-------:|
|`brightness`    |✅       |
|`blur`          |🟡       |
|`contrast`      |✅       |
|`drop-shadow`   |🟡       |
|`grayscale`     |✅       |
|`hue-rotate`    |✅       |
|`invert`        |✅       |
|`opacity`       |✅       |
|`saturate`      |✅       |
|`sepia`         |✅       |

#### Why are `blur` and `drop-shadow` different?

These don't have first-class support because the SVG filter function templates require several inputs which cannot easily be parsed from a CSS filter. By default `blur` and `drop-shadow` will be ignored from CSS filters. However, they can be added to an SVG filter by manually passing the inputs as parameters to the [constructor](#constructor).

```javascript
const cssFilter = 'filter: invert(50%);';
const params = {
  blur: {
    radius: '',
    edgeMode: '',
  },
  dropShadow:{
    alphaChannelOfInput: '',
    radius: '',
    offsetX: '',
    offsetY: '',
    color: '',
  },
};
const customConverter = new CSSFilterToSVGFilter(cssFilter, params);
```

## Links/Resources

- [CSS filter property](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)
- [SVG filter element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter)
- [SVG filter templates](https://www.w3.org/TR/filter-effects-1/#FilterPrimitiveRepresentation)

## License

[MIT](LICENSE)
