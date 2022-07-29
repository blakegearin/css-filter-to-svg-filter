class CSSFilterToSVGFilter {
  static SVG_FILTER_TEMPLATES = {
    blur: {
      template: '<feGaussianBlur stdDeviation="[radius radius]" edgeMode="[edge mode]">'
    },
    brightness: {
      template: '<feComponentTransfer><feFuncR type="linear" slope="[slope]"/><feFuncG type="linear" slope="[slope]"/><feFuncB type="linear" slope="[slope]"/></feComponentTransfer>',
      slope: '[amount]'
    },
    contrast: {
      template: '<feComponentTransfer><feFuncR type="linear" slope="[amount]" intercept="[intercept]"/><feFuncG type="linear" slope="[amount]" intercept="[intercept]"/><feFuncB type="linear" slope="[slope]" intercept="[intercept]"/></feComponentTransfer>',
      slope: '[amount]',
      intercept: '-(0.5 * [amount]) + 0.5'
    },
    'drop-shadow': {
      template: '<feGaussianBlur in="[alpha-channel-of-input]" stdDeviation="[radius]"/><feOffset dx="[offset-x]" dy="[offset-y]" result="offsetblur"/><feFlood flood-color="[color]"/><feComposite in2="offsetblur" operator="in"/><feMerge><feMergeNode/><feMergeNode in="[input-image]"/></feMerge>'
    },
    grayscale: {
      template: '<feColorMatrix type="matrix" values="[1] [2] [3] 0 0 [4] [5] [6] 0 0 [7] [8] [9] 0 0 0 0 0 1 0"/>',
      1: '0.2126 + 0.7874 * [1 - amount]',
      2: '0.7152 - 0.7152 * [1 - amount]',
      3: '0.0722 - 0.0722 * [1 - amount]',
      4: '0.2126 - 0.2126 * [1 - amount]',
      5: '0.7152 + 0.2848 * [1 - amount]',
      6: '0.0722 - 0.0722 * [1 - amount]',
      7: '0.2126 - 0.2126 * [1 - amount]',
      8: '0.7152 - 0.7152 * [1 - amount]',
      9: '0.0722 + 0.9278 * [1 - amount]'
    },
    'hue-rotate': {
      template: '<feColorMatrix type="hueRotate" values="[angle]"/>',
      angle: '[amount]'
    },
    invert: {
      template: '<feComponentTransfer><feFuncR type="table" tableValues="[amount] [1 - amount]"/><feFuncG type="table" tableValues="[amount] [1 - amount]"/><feFuncB type="table" tableValues="[amount] [1 - amount]"/></feComponentTransfer>'
    },
    opacity: {
      template: '<feComponentTransfer><feFuncA type="table" tableValues="0 [amount]"/></feComponentTransfer>'
    },
    saturate: {
      template: '<feColorMatrix type="saturate" values="[amount]"/>'
    },
    sepia: {
      template: '<feColorMatrix type="matrix" values="[1] [2] [3] 0 0 [4] [5] [6] 0 0 [7] [8] [9] 0 0 0 0 0 1 0"/>',
      1: '0.393 + 0.607 * [1 - amount]',
      2: '0.769 - 0.769 * [1 - amount]',
      3: '0.189 - 0.189 * [1 - amount]',
      4: '0.349 - 0.349 * [1 - amount]',
      5: '0.686 + 0.314 * [1 - amount]',
      6: '0.168 - 0.168 * [1 - amount]',
      7: '0.272 - 0.272 * [1 - amount]',
      8: '0.534 - 0.534 * [1 - amount]',
      9: '0.131 + 0.869 * [1 - amount]'
    }
  }

  constructor (cssFilter, { filterId = '', includeBlur = false, includeDropShadow = false } = {}) {
    if (cssFilter == null) throw new Error('Required parameter cssFilter is null')

    this.cssFilter = this.#sanitizeCSSFilter(cssFilter)
    this.filterId = filterId
    this.includeBlur = includeBlur
    this.includeDropShadow = includeDropShadow
  }

  toCSSFilterObject () {
    const result = {}
    const cssFilterArray = this.cssFilter.split(/[()]+/).filter(e => String(e).trim())

    for (let i = 0; i < cssFilterArray.length; i++) {
      if ((i % 2) !== 0) continue

      const key = cssFilterArray[i]
      if (!this.includeBlur && key === 'blur') continue
      if (!this.includeDropShadow && key === 'drop-shadow') continue

      const value = cssFilterArray[++i]

      result[key] = {
        original: value,
        processed: this.#computeFilterValue(value)
      }
    }

    return result
  }

  toSVGFilterObject ({ cssFilterObject = this.toCSSFilterObject() } = {}) {
    const result = {}

    Object.entries(cssFilterObject).forEach(([key, value]) => {
      result[key] = this.#convertFilterFunction(key, value.processed)
    })

    return result
  }

  toSVGFilter ({ filterId = this.filterId, attributes = 'color-interpolation-filters="sRGB"', svgFilterFunctions = Object.values(this.toSVGFilterObject()) } = {}) {
    if (filterId) filterId = ` id="${filterId}"`
    if (attributes) attributes = ` ${attributes}`

    return `<filter${filterId}${attributes}>${svgFilterFunctions.join('')}</filter>`
  }

  toSVG ({ attributes = 'width="100%" height="100%"', svgFilter = this.toSVGFilter() } = {}) {
    if (attributes) attributes = ` ${attributes}`
    return `<svg${attributes}>${svgFilter}</svg>`
  }

  #sanitizeCSSFilter (cssFilter) {
    cssFilter = replaceAll(cssFilter, 'filter:', '')
    cssFilter = replaceAll(cssFilter, ';', '')
    return replaceAll(cssFilter, ' ', '')
  }

  #computeFilterValue (value) {
    const isPercentage = value.includes('%')
    const isDegree = value.includes('deg')

    if (isPercentage) {
      const integer = parseInt(value.replace('%'))
      if (isNaN(integer)) return value

      return integer / 100
    } else if (isDegree) {
      const integer = parseInt(value.replace('deg'))
      if (isNaN(integer)) return value

      return integer
    }

    return value
  }

  #convertFilterFunction (key, value) {
    let svgFilterFunctionTemplate = CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES[key].template

    Object.entries(CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES[key]).forEach(([filterKey, filterValue]) => {
      if (filterKey === 'template') return

      filterValue = replaceAll(filterValue, '[amount]', value)
      filterValue = replaceAll(filterValue, '[1 - amount]', (1 - value))
      // Strip anything other than digits, (), -+/* and .
      const escapedFilterValue = filterValue.replace(/[^-()\d/*+.]/g, '')

      svgFilterFunctionTemplate = replaceAll(
        svgFilterFunctionTemplate,
        `[${filterKey}]`,
        eval(escapedFilterValue) // eslint-disable-line no-eval
      )
    })

    svgFilterFunctionTemplate = replaceAll(svgFilterFunctionTemplate, '[angle]', value)
    svgFilterFunctionTemplate = replaceAll(svgFilterFunctionTemplate, '[amount]', value)
    svgFilterFunctionTemplate = replaceAll(svgFilterFunctionTemplate, '[1 - amount]', (1 - value))
    svgFilterFunctionTemplate = replaceAll(svgFilterFunctionTemplate, '[amount - 1]', (value - 1))

    return svgFilterFunctionTemplate
  }
}

function escapeRegExp (string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function replaceAll (str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

export default CSSFilterToSVGFilter
