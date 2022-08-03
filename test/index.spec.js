import assert from 'assert'
import CSSFilterToSVGFilter from '../src/index.js'

describe('CSSFilterToSVGFilter', function () {
  let cssFilterToSVGFilter

  describe('parameters', function () {
    describe('cssFilter', function () {
      describe('when null', function () {
        it('should throw error', function () {
          assert.throws(() => new CSSFilterToSVGFilter(null))
        })
      })

      describe('when undefined', function () {
        it('should throw error', function () {
          assert.throws(() => new CSSFilterToSVGFilter(undefined))
        })
      })

      describe('when defined', function () {
        describe('with a \'filter:\' prefix', function () {
          const cssFilter = 'filter: function(100);'

          beforeEach(function () {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
          })

          it('should strips prefix', function () {
            assert.equal(cssFilterToSVGFilter.cssFilter.includes('filter:'), false)
          })
        })

        describe('with spaces', function () {
          const cssFilter = 'filter: function(100) function(200);'

          beforeEach(function () {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
          })

          it('should strips spaces', function () {
            assert.equal(cssFilterToSVGFilter.cssFilter.includes(' '), false)
          })
        })

        describe('with semicolon (;)', function () {
          const cssFilter = 'filter: function(100) function(200);'

          beforeEach(function () {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
          })

          it('should strips semicolon (;)', function () {
            assert.equal(cssFilterToSVGFilter.cssFilter.includes(';'), false)
          })
        })
      })
    })
  })

  describe('SVG_FILTER_TEMPLATES static class property', function () {
    const numberOfFilterTemplates = 10

    beforeEach(function () {
      cssFilterToSVGFilter = new CSSFilterToSVGFilter('')
    })

    it('should be an object', function () {
      assert.equal(typeof CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES, 'object')
    })

    it(`should have ${numberOfFilterTemplates} keys`, function () {
      assert.equal(
        Object.keys(CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES).length,
        numberOfFilterTemplates
      )
    })

    it('should have functions as values', function () {
      Object.values(CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES).forEach((childObject) => {
        assert.equal(typeof childObject, 'function')
      })
    })

    describe('for values other than blur and drop-shadow', function () {
      describe('when one parameter is included', function () {
        it('returns a string', function () {
          Object.entries(CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES).forEach(([key, value]) => {
            if (['blur', 'drop-shadow'].includes(key)) return
            assert.equal(typeof value(1), 'string')
          })
        })
      })

      describe('when no parameter is included', function () {
        it('should throw error', function () {
          Object.entries(CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES).forEach(([key, value]) => {
            if (['blur', 'drop-shadow'].includes(key)) return

            assert.throws(() => value())
          })
        })
      })
    })

    describe('for blur', function () {
      const radius = 1

      describe('when one parameter is included', function () {
        it('returns a string', function () {
          assert.equal(typeof CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES.blur({ radius }), 'string')
        })

        describe('optional function parameter edgeMode', function () {
          const defaultEdgeMode = 'none'

          it('should default to \'none\'', function () {
            assert.equal(
              CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES.blur({ radius }),
              CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES.blur({ radius, edgeMode: defaultEdgeMode })
            )
          })
        })
      })

      describe('when two parameters are included', function () {
        const edgeMode = 'duplicate'

        it('returns a string', function () {
          assert.equal(
            typeof CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES.blur({ radius, edgeMode }),
            'string'
          )
        })

        describe('optional function parameter edgeMode', function () {
          it('should not match default', function () {
            assert.notEqual(
              CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES.blur({ radius }),
              CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES.blur({ radius, edgeMode })
            )
          })
        })
      })

      describe('when no parameter is included', function () {
        it('should throw error', function () {
          assert.throws(() => CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES.blur())
        })
      })
    })

    describe('for drop-shadow', function () {
      const alphaChannelOfInput = 1
      const radius = 2
      const offsetX = 3
      const offsetY = 4
      const color = 5

      describe('when less than 5 parameters are included', function () {
        it('should throw error', function () {
          assert.throws(() => CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES['drop-shadow']({}))
          assert.throws(() => {
            CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES['drop-shadow']({
              alphaChannelOfInput
            })
          })
          assert.throws(() => {
            CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES['drop-shadow']({
              alphaChannelOfInput,
              radius
            })
          })
          assert.throws(() => {
            CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES['drop-shadow']({
              alphaChannelOfInput,
              radius,
              offsetX
            })
          })
          assert.throws(() => {
            CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES['drop-shadow']({
              alphaChannelOfInput,
              radius,
              offsetX,
              offsetY
            })
          })
        })
      })

      describe('when five parameters are included', function () {
        it('returns a string', function () {
          const dropShadow = CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES['drop-shadow']({
            alphaChannelOfInput,
            radius,
            offsetX,
            offsetY,
            color
          })

          assert.equal(typeof dropShadow, 'string')
        })
      })
    })
  })

  describe('toCSSFilterObject()', function () {
    beforeEach(function () {
      cssFilterToSVGFilter = new CSSFilterToSVGFilter('')
    })

    it('should return object', function () {
      const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

      assert.equal(typeof cssFilterObject, 'object')
    })

    describe('when a cssFilter has a filter function', function () {
      const cssFilter = 'filter: function(100);'

      beforeEach(function () {
        cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
      })

      it('should have child objects as values', function () {
        const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()
        const childObject = Object.values(cssFilterObject)[0]

        assert.equal(typeof childObject, 'object')
      })

      describe('child objects', function () {
        it('should have an original key and processed key', function () {
          const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()
          const childObject = Object.values(cssFilterObject)[0]

          assert.equal(Object.keys(childObject).includes('original'), true)
          assert.equal(Object.keys(childObject).includes('processed'), true)
        })
      })

      describe('optional class parameter blur', function () {
        const key = 'blur'
        const cssFilterFunction = key

        describe('when not provided', function () {
          beforeEach(function () {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
          })

          describe(`when ${cssFilterFunction} filter function is not included`, function () {
            const cssFilter = 'filter: function(100)'

            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
            })

            it(`should not have ${key} as key`, function () {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

              assert.equal(Object.keys(cssFilterObject).includes(key), false)
            })
          })

          describe(`when ${cssFilterFunction} filter function is included`, function () {
            const cssFilter = 'filter: function(100) blur(5px);'

            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
            })

            it(`should not have ${key} as key`, function () {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

              assert.equal(Object.keys(cssFilterObject).includes(key), false)
            })
          })
        })

        describe('when provided', function () {
          const blur = {
            radius: 10,
            edgeMode: 'none'
          }

          beforeEach(function () {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, { blur })
          })

          it(`should have ${key} as key`, function () {
            const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

            assert.equal(Object.keys(cssFilterObject).includes(key), true)
          })

          it(`should have ${key} key with value equal to parameter`, function () {
            const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

            assert.equal(cssFilterObject.blur, blur)
          })
        })
      })

      describe('optional class parameter dropShadow', function () {
        const key = 'dropShadow'
        const cssFilterFunction = 'drop-shadow'

        describe('when not provided', function () {
          beforeEach(function () {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
          })

          describe(`when ${cssFilterFunction} filter function is not included`, function () {
            const cssFilter = 'filter: function(100)'

            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
            })

            it('should not have dropShadow as key', function () {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

              assert.equal(Object.keys(cssFilterObject).includes(key), false)
            })
          })

          describe(`when ${cssFilterFunction} filter function is included`, function () {
            const cssFilter = 'filter: function(100) blur(5px);'

            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
            })

            it(`should not have ${key} as key`, function () {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

              assert.equal(Object.keys(cssFilterObject).includes(key), false)
            })
          })
        })

        describe('when provided', function () {
          const dropShadow = {
            alphaChannelOfInput: 1,
            radius: 2,
            offsetX: 3,
            offsetY: 4,
            color: 5
          }

          beforeEach(function () {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, { dropShadow })
          })

          it(`should have ${key} as key`, function () {
            const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

            assert.equal(Object.keys(cssFilterObject).includes(key), true)
          })

          it(`should have ${key} key with value equal to parameter`, function () {
            const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

            assert.equal(cssFilterObject.dropShadow, dropShadow)
          })
        })
      })
    })

    describe('when a cssFilter has multiple filter functions', function () {
      const cssFilter = 'filter: function(100) function2(200) function3(300);'

      beforeEach(function () {
        cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
      })

      it('should have number of keys equal to filter functions', function () {
        const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

        assert.equal(Object.keys(cssFilterObject).length, 3)
      })
    })
  })

  describe('toSVGFilterObject()', function () {
    const cssFilter = 'filter: invert(10%) grayscale(90%) saturate(40%);'

    beforeEach(function () {
      cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
    })

    it('should return object', function () {
      assert.equal(typeof cssFilterToSVGFilter.toSVGFilterObject(), 'object')
    })

    it('should have number of keys equal to keys of toCSSFilterObjects', function () {
      const svgFilterObject = cssFilterToSVGFilter.toSVGFilterObject()
      const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

      assert.equal(
        Object.keys(svgFilterObject).length,
        Object.keys(cssFilterObject).length
      )
    })

    it('should have number of keys equal to keys of cssFilterObject', function () {
      const svgFilterObject = cssFilterToSVGFilter.toSVGFilterObject()
      const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

      assert.equal(
        Object.keys(svgFilterObject).length,
        Object.keys(cssFilterObject).length
      )
    })

    it('should have values that are de-generalized SVG_FILTER_TEMPLATES', function () {
      const svgFilterObject = cssFilterToSVGFilter.toSVGFilterObject()
      const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

      const key = 'saturate'
      const processedValue = cssFilterObject[key].processed
      const degeneralizedSVGFilterTemplate =
        CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES[key](processedValue)

      assert.equal(svgFilterObject[key], degeneralizedSVGFilterTemplate)
    })

    describe('optional method parameter cssFilterObject', function () {
      describe('when not provided', function () {
        it('should default to calling toCSSFilterObject()', function () {
          const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject()

          assert.equal(
            cssFilterToSVGFilter.toSVGFilterObject().invert,
            cssFilterToSVGFilter.toSVGFilterObject({ cssFilterObject }).invert
          )
        })
      })

      describe('when provided', function () {
        it('should not match toCSSFilterObject()', function () {
          const cssFilterObject = {
            grayscale: {
              original: '50%',
              processed: 0.5
            }
          }

          assert.notEqual(
            cssFilterToSVGFilter.toSVGFilterObject({ cssFilterObject }).invert,
            cssFilterToSVGFilter.toSVGFilterObject().invert
          )
        })

        describe('when blur is present', function () {
          const cssFilterObject = {
            blur: {
              radius: 5,
              edgeMode: 'none'
            }
          }

          describe('optional class parameter blur', function () {
            describe('when not provided', function () {
              beforeEach(function () {
                cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
              })

              it('should not be included in output', function () {
                const svgFilterObject = cssFilterToSVGFilter.toSVGFilterObject({ cssFilterObject })

                assert.equal(Object.entries(svgFilterObject).length, 0)
              })
            })

            describe('when provided', function () {
              const blur = {
                radius: 10,
                edgeMode: 'none'
              }

              beforeEach(function () {
                cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, { blur })
              })

              it('should be present as key with string value', function () {
                const svgFilterObject = cssFilterToSVGFilter.toSVGFilterObject({ cssFilterObject })

                assert.equal(typeof svgFilterObject.blur, 'string')
              })
            })
          })
        })
        describe('when drop-shadow is present', function () {
          const cssFilterObject = {
            'drop-shadow': {
              alphaChannelOfInput: 1,
              radius: 2,
              offsetX: 3,
              offsetY: 4,
              color: 5
            }
          }

          describe('optional class parameter dropShadow', function () {
            describe('when not provided', function () {
              beforeEach(function () {
                cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
              })

              it('should not be included in output', function () {
                const svgFilterObject = cssFilterToSVGFilter.toSVGFilterObject({ cssFilterObject })

                assert.equal(Object.entries(svgFilterObject).length, 0)
              })
            })

            describe('when provided', function () {
              const dropShadow = {
                alphaChannelOfInput: 1,
                radius: 2,
                offsetX: 3,
                offsetY: 4,
                color: 5
              }

              beforeEach(function () {
                cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, { dropShadow })
              })

              it('should be present as key with string value', function () {
                const svgFilterObject = cssFilterToSVGFilter.toSVGFilterObject({ cssFilterObject })

                assert.equal(typeof svgFilterObject['drop-shadow'], 'string')
              })
            })
          })
        })

        // describe('when drop-shadow is present', function () {
        //   it('should pass through value unchanged', function () {
        //     const cssFilterObject = {
        //       'drop-shadow': {
        //         alphaChannelOfInput: '',
        //         radius: '',
        //         offsetX: '',
        //         offsetY: '',
        //         color: ''
        //       }
        //     }

        //     assert.notEqual(
        //       cssFilterToSVGFilter.toSVGFilterObject({ cssFilterObject }),
        //       cssFilterObject
        //     )
        //   })
        // })
      })
    })
  })

  describe('toSVGFilter()', function () {
    const cssFilter = 'filter: invert(50%);'

    beforeEach(function () {
      cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
    })

    it('should return string containing \'<filter\' and \'</filter>\'', function () {
      const svgFilter = cssFilterToSVGFilter.toSVGFilter()

      assert.equal(typeof svgFilter, 'string')
      assert.equal(svgFilter.includes('<filter'), true)
      assert.equal(svgFilter.includes('</filter>'), true)
    })

    describe('optional class parameter filterId', function () {
      const filterId = 'greatId'

      describe('when not provided', function () {
        beforeEach(function () {
          cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, { filterId })
        })

        it('should default to this.filterId', function () {
          assert.equal(
            cssFilterToSVGFilter.toSVGFilter(),
            cssFilterToSVGFilter.toSVGFilter({ filterId })
          )
        })

        describe('this.filterId', function () {
          describe('when not provided', function () {
            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
            })

            it('should not include \'id=\'', function () {
              const svgFilter = cssFilterToSVGFilter.toSVGFilter()

              assert.equal(svgFilter.includes('id='), false)
            })
          })

          describe('when provided', function () {
            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, { filterId })
            })

            it('should include \'<filter id="{filterId}"\'', function () {
              const svgFilter = cssFilterToSVGFilter.toSVGFilter()

              assert.equal(svgFilter.includes(`<filter id="${filterId}"`), true)
            })
          })
        })
      })

      describe('when provided', function () {
        beforeEach(function () {
          cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, { filterId })
        })

        it('should default to this.filterId', function () {
          assert.equal(
            cssFilterToSVGFilter.toSVGFilter(),
            cssFilterToSVGFilter.toSVGFilter({ filterId })
          )
        })

        it('should include \'<filter id="{filterId}"\'', function () {
          const svgFilter = cssFilterToSVGFilter.toSVGFilter()

          assert.equal(svgFilter.includes(`<filter id="${filterId}"`), true)
        })
      })
    })

    describe('optional method parameter attributes', function () {
      const cssFilter = 'filter: invert(50%);'

      describe('when not provided', function () {
        const defaultAttributes = 'color-interpolation-filters="sRGB"'

        beforeEach(function () {
          cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
        })

        it(`should default to '${defaultAttributes}'`, function () {
          const svgFilter = cssFilterToSVGFilter.toSVGFilter()

          assert.equal(svgFilter.includes(`<filter ${defaultAttributes}>`), true)
        })
      })

      describe('when provided', function () {
        const attributes = 'class="greatClassName"'

        beforeEach(function () {
          cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
        })

        it('should include \'<filter {attributes}>\'', function () {
          const svgFilter = cssFilterToSVGFilter.toSVGFilter({ attributes })

          assert.equal(svgFilter.includes(`<filter ${attributes}>`), true)
        })
      })
    })
  })

  describe('toSVG()', function () {
    const cssFilter = 'filter: invert(50%);'

    beforeEach(function () {
      cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
    })

    it('should return string containing \'<svg\' and \'</svg>\'', function () {
      const svg = cssFilterToSVGFilter.toSVG()

      assert.equal(typeof svg, 'string')
      assert.equal(svg.includes('<svg'), true)
      assert.equal(svg.includes('</svg>'), true)
    })

    describe('optional method parameter attributes', function () {
      const defaultAttributes = 'width="100%" height="100%"'

      describe('when not provided', function () {
        it(`should default to '${defaultAttributes}'`, function () {
          const svgFilter = cssFilterToSVGFilter.toSVG()

          assert.equal(svgFilter.includes(`<svg ${defaultAttributes}>`), true)
        })
      })

      describe('when provided', function () {
        const attributes = 'class="greatClassName"'

        it('should include \'<svg {attributes}>\'', function () {
          const svg = cssFilterToSVGFilter.toSVG({ attributes })

          assert.equal(svg.includes(`<svg ${attributes}>`), true)
        })
      })
    })

    describe('optional class parameter svgFilter', function () {
      describe('when not provided', function () {
        it('should default to calling toSVGFilter()', function () {
          const svgFilter = cssFilterToSVGFilter.toSVGFilter()

          assert.equal(
            cssFilterToSVGFilter.toSVG(),
            cssFilterToSVGFilter.toSVG({ svgFilter })
          )
        })
      })

      describe('when provided', function () {
        it('should not match toSVGFilter()', function () {
          const svgFilter = '<filter></filter>'

          assert.notEqual(
            cssFilterToSVGFilter.toSVG({ svgFilter }),
            cssFilterToSVGFilter.toSVG()
          )

          const invertSVGFilterTemplate = CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES.invert.template

          console.dir(invertSVGFilterTemplate)
        })
      })
    })
  })

  describe('computeFilterValue()', function () {
    const cssFilter = 'filter: invert(50%);'

    beforeEach(function () {
      cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter)
    })

    describe('with a value containing \'%\'', function () {
      describe('when an integer can be parsed', function () {
        describe('of 100%', function () {
          const inputValue = '100%'
          const expectedValue = 1

          it(`should return ${expectedValue}`, function () {
            assert.equal(cssFilterToSVGFilter.computeFilterValue(inputValue), expectedValue)
          })
        })

        describe('of 50%', function () {
          const inputValue = '50%'
          const expectedValue = 0.5

          it(`should return ${expectedValue}`, function () {
            assert.equal(cssFilterToSVGFilter.computeFilterValue(inputValue), expectedValue)
          })
        })

        describe('of 0%', function () {
          const inputValue = '0%'
          const expectedValue = 0

          it(`should return ${expectedValue}`, function () {
            assert.equal(cssFilterToSVGFilter.computeFilterValue(inputValue), expectedValue)
          })
        })
      })

      describe('when an integer can not be parsed', function () {
        const inputValue = 'notAnInteger%'

        it('should return the same value unchanged', function () {
          assert.equal(cssFilterToSVGFilter.computeFilterValue(inputValue), inputValue)
        })
      })
    })

    describe('with a value containing \'deg\'', function () {
      describe('when an integer can be parsed', function () {
        const inputValue = '100deg'
        const expectedValue = 100

        it(`should return ${expectedValue} not containing deg prefix`, function () {
          assert.equal(cssFilterToSVGFilter.computeFilterValue(inputValue), expectedValue)
        })
      })

      describe('when an integer can not be parsed', function () {
        const inputValue = 'notAnIntegerdeg'

        it('should return the same value unchanged', function () {
          assert.equal(cssFilterToSVGFilter.computeFilterValue(inputValue), inputValue)
        })
      })
    })

    describe('with a value that\'s not a percentage or degree', function () {
      const inputValue = '100'

      it('should return the same value unchanged', function () {
        assert.equal(cssFilterToSVGFilter.computeFilterValue(inputValue), inputValue)
      })
    })
  })
})
