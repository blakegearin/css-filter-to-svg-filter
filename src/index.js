class CSSFilterToSVGFilter {
  static SVG_FILTER_TEMPLATES = {
    blur: ({ radius, edgeMode } = {}) => {
      return `<feGaussianBlur stdDeviation="${radius} ${radius}" edgeMode="${edgeMode}">`
    },
    brightness: (amount) => {
      const slope = amount

      return `<feComponentTransfer><feFuncR type="linear" slope="${slope}"/><feFuncG type="linear" slope="${slope}"/><feFuncB type="linear" slope="${slope}"/></feComponentTransfer>`
    },
    contrast: (amount) => {
      const slope = amount
      const intercept = -(0.5 * amount) + 0.5

      return `<feComponentTransfer><feFuncR type="linear" slope="${slope}" intercept="${intercept}"/><feFuncG type="linear" slope="${slope}" intercept="${intercept}"/><feFuncB type="linear" slope="${slope}" intercept="${intercept}"/></feComponentTransfer>`
    },
    'drop-shadow': ({ alphaChannelOfInput, radius, offsetX, offsetY, color } = {}) => {
      return `<feGaussianBlur in="${alphaChannelOfInput}" stdDeviation="${radius}"/><feOffset dx="${offsetX}" dy="${offsetY}" result="offsetblur"/><feFlood flood-color="${color}"/><feComposite in2="offsetblur" operator="in"/><feMerge><feMergeNode/><feMergeNode in="[input-image]"/></feMerge>`
    },
    grayscale: (amount) => {
      const value1 = 0.2126 + 0.7874 * (1 - amount)
      const value2 = 0.7152 - 0.7152 * (1 - amount)
      const value3 = 0.0722 - 0.0722 * (1 - amount)
      const value4 = 0.2126 - 0.2126 * (1 - amount)
      const value5 = 0.7152 + 0.2848 * (1 - amount)
      const value6 = 0.0722 - 0.0722 * (1 - amount)
      const value7 = 0.2126 - 0.2126 * (1 - amount)
      const value8 = 0.7152 - 0.7152 * (1 - amount)
      const value9 = 0.0722 + 0.9278 * (1 - amount)

      return `<feColorMatrix type="matrix" values="${value1} ${value2} ${value3} 0 0 ${value4} ${value5} ${value6} 0 0 ${value7} ${value8} ${value9} 0 0 0 0 0 1 0"/>`
    },
    'hue-rotate': (amount) => {
      const angle = amount

      return `<feColorMatrix type="hueRotate" values="${angle}"/>`
    },
    invert: (amount) => {
      return `<feComponentTransfer><feFuncR type="table" tableValues="${amount} ${1 - amount}"/><feFuncG type="table" tableValues="${amount} ${1 - amount}"/><feFuncB type="table" tableValues="${amount} ${1 - amount}"/></feComponentTransfer>`
    },
    opacity: (amount) => {
      return `<feComponentTransfer><feFuncA type="table" tableValues="0 ${amount}"/></feComponentTransfer>`
    },
    saturate: (amount) => {
      return `<feColorMatrix type="saturate" values="${amount}"/>`
    },
    sepia: (amount) => {
      const value1 = 0.393 + 0.607 * (1 - amount)
      const value2 = 0.769 - 0.769 * (1 - amount)
      const value3 = 0.189 - 0.189 * (1 - amount)
      const value4 = 0.349 - 0.349 * (1 - amount)
      const value5 = 0.686 + 0.314 * (1 - amount)
      const value6 = 0.168 - 0.168 * (1 - amount)
      const value7 = 0.272 - 0.272 * (1 - amount)
      const value8 = 0.534 - 0.534 * (1 - amount)
      const value9 = 0.131 + 0.869 * (1 - amount)

      return `<feColorMatrix type="matrix" values="${value1} ${value2} ${value3} 0 0 ${value4} ${value5} ${value6} 0 0 ${value7} ${value8} ${value9} 0 0 0 0 0 1 0"/>`
    }
  }

  constructor (cssFilter, { filterId = '', blur = {}, dropShadow = {} } = {}) {
    if (cssFilter == null) throw new Error('Required parameter cssFilter is null')

    this.cssFilter = cssFilter.replace(/(filter:)|;|[\s]/g, '')
    this.filterId = filterId
    this.blur = blur
    this.dropShadow = dropShadow
  }

  toCSSFilterObject () {
    const result = {}
    const cssFilterArray = this.cssFilter.split(/[()]+/).filter(e => String(e).trim())

    for (let i = 0; i < cssFilterArray.length; i++) {
      if ((i % 2) !== 0) continue

      const key = cssFilterArray[i]
      if (['blur', 'drop-shadow'].includes(key)) continue

      const value = cssFilterArray[++i]

      result[key] = {
        original: value,
        processed: this.#computeFilterValue(value)
      }
    }

    if (Object.entries(this.blur).length) result.blur = this.blur
    if (Object.entries(this.dropShadow).length) result.dropShadow = this.dropShadow

    return result
  }

  toSVGFilterObject ({ cssFilterObject = this.toCSSFilterObject() } = {}) {
    const result = {}

    Object.entries(cssFilterObject).forEach(([key, value]) => {
      let input
      switch (key) {
        case 'blur':
          if (Object.entries(this.blur).length) input = value
          return
        case 'drop-shadow':
          if (Object.entries(this.dropShadow).length) input = value
          return
        default:
          input = value.processed
      }

      result[key] = CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES[key](input)
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
}

export default CSSFilterToSVGFilter
