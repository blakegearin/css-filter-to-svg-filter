import assert from 'assert';
import CSSFilterToSVGFilter from '../src/index.js';

describe('', function() {
});

describe('CSSFilterToSVGFilter', function() {
  let cssFilterToSVGFilter;

  describe('parameters', function() {
    describe('cssFilter', function() {
      describe('when null', function() {
        it('should throw error', function() {
          try {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(null);
          } catch(e) {
            assert.equal(e, 'Required parameter cssFilter is null');
          }
        });
      });

      describe('when undefined', function() {
        it('should throw error', function() {
          try {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(undefined);
          } catch(e) {
            assert.equal(e, 'Required parameter cssFilter is null');
          }
        });
      });

      describe('when defined', function() {
        describe('with a \'filter:\' prefix', function() {
          const cssFilter = 'filter: function(100);'

          beforeEach(function () {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
          });

          it('should strips prefix', function() {
            assert.equal(cssFilterToSVGFilter.cssFilter.includes('filter:'), false);
          });
        });

        describe('with spaces', function() {
          const cssFilter = 'filter: function(100) function(200);'

          beforeEach(function () {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
          });

          it('should strips spaces', function() {
            assert.equal(cssFilterToSVGFilter.cssFilter.includes(' '), false);
          });
        });

        describe('with semicolon (;)', function() {
          const cssFilter = 'filter: function(100) function(200);'

          beforeEach(function () {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
          });

          it('should strips semicolon (;)', function() {
            assert.equal(cssFilterToSVGFilter.cssFilter.includes(';'), false);
          });
        });
      });
    });
  });

  describe('SVG_FILTER_TEMPLATES static class property', function() {
    let numberOfFilterTemplates = 10;

    beforeEach(function () {
      cssFilterToSVGFilter = new CSSFilterToSVGFilter('');
    });

    it('should be an object', function() {
      assert.equal(typeof CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES, 'object');
    });

    it(`should have ${numberOfFilterTemplates} keys`, function() {
      assert.equal(
        Object.keys(CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES).length,
        numberOfFilterTemplates
      );
    });

    it('should have child objects as values', function() {
      const childObject = Object.values(CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES)[0];

      assert.equal(typeof childObject, 'object');
    });

    describe('child objects', function() {
      it('should have a template key', function() {
        const childObject = Object.values(CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES)[0];

        assert.equal(Object.keys(childObject).includes('template'), true);
      });
    });
  });

  describe('toCSSFilterObject()', function() {
    beforeEach(function () {
      cssFilterToSVGFilter = new CSSFilterToSVGFilter('');
    });

    it('should return object', function() {
      const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();

      assert.equal(typeof cssFilterObject, 'object');
    });

    describe('when a cssFilter has a filter function', function() {
      const cssFilter = 'filter: function(100);';

      beforeEach(function () {
        cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
      });

      it('should have child objects as values', function() {
        const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();
        const childObject = Object.values(cssFilterObject)[0];

        assert.equal(typeof childObject, 'object');
      });

      describe('child objects', function() {
        it('should have an original key and processed key', function() {
          const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();
          const childObject = Object.values(cssFilterObject)[0];

          assert.equal(Object.keys(childObject).includes('original'), true);
          assert.equal(Object.keys(childObject).includes('processed'), true);
        });

        describe('with a percentage value', function() {
          describe('of 100%', function() {
            const filterFunctionValue = '100%';
            const processedValue = 1;
            const cssFilter = `filter: function(${filterFunctionValue});`;

            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
            });

            it(`should have a processed key of ${processedValue}`, function() {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();
              const childObject = Object.values(cssFilterObject)[0];

              assert.equal(childObject['processed'], processedValue);
            });
          });

          describe('of 50%', function() {
            const filterFunctionValue = '50%';
            const processedValue = 0.5;
            const cssFilter = `filter: function(${filterFunctionValue});`;

            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
            });

            it(`should have a processed key of ${processedValue}`, function() {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();
              const childObject = Object.values(cssFilterObject)[0];

              assert.equal(childObject['processed'], processedValue);
            });
          });

          describe('of 0%', function() {
            const filterFunctionValue = '0%';
            const processedValue = 0;

            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(
                `filter: function(${filterFunctionValue});`
              );
            });

            it(`should have a processed key of ${processedValue}`, function() {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();
              const childObject = Object.values(cssFilterObject)[0];

              assert.equal(childObject['processed'], processedValue);
            });
          });
        });

        describe('with a degree value', function() {
          const filterFunctionValue = '100deg';
          const processedValue = 100;
          const cssFilter = `filter: function(${filterFunctionValue});`;

          beforeEach(function () {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
          });

          it(`should have a processed key not containing deg prefix`, function() {
            const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();
            const childObject = Object.values(cssFilterObject)[0];

            assert.equal(childObject['processed'].toString().includes('deg'), false);
            assert.equal(childObject['processed'], processedValue);
          });
        });

        describe('with a value that\'s not a percentage or degree', function() {
          const filterFunctionValue = '100';
          const cssFilter = `filter: function(${filterFunctionValue});`;

          beforeEach(function () {
            cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
          });

          it(`should have a processed key equal to original key`, function() {
            const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();
            const childObject = Object.values(cssFilterObject)[0];

            assert.equal(childObject['processed'], childObject['original']);
          });
        });
      });

      describe('when blur filter function is included', function() {
        const cssFilter = 'filter: function(100) blur(5px);'

        describe('optional class parameter includeBlur', function() {
          describe('when not provided', function() {
            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
            });

            it('should default to false', function() {
              assert.equal(cssFilterToSVGFilter.includeBlur, false);
            });
          });

          describe('when false', function() {
            const includeBlur = false;

            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, {includeBlur});
            });

            it('should not have blur as key', function() {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();

              assert.equal(Object.keys(cssFilterObject).includes('blur'), false);
            });
          });

          describe('when true', function() {
            const includeBlur = true;

            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, {includeBlur});
            });

            it('should have blur as key', function() {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();

              assert.equal(Object.keys(cssFilterObject).includes('blur'), true);
            });

            it('should have child object with processed key equal to original key', function() {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();
              const childObject = cssFilterObject['blur'];

              assert.equal(childObject['processed'], childObject['original']);
            });
          });
        });
      });

      describe('when drop-shadow filter function is included', function() {
        const cssFilter = 'filter: function(100) drop-shadow(5px 2px 2px #424242);'

        describe('optional class parameter includeDropShadow', function() {
          describe('when not provided', function() {
            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
            });

            it('should default to false', function() {
              assert.equal(cssFilterToSVGFilter.includeDropShadow, false);
            });
          });

          describe('when false', function() {
            const includeDropShadow = false;

            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, {includeDropShadow});
            });

            it('should not have drop-shadow as key', function() {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();

              assert.equal(Object.keys(cssFilterObject).includes('drop-shadow'), false);
            });
          });

          describe('when true', function() {
            const includeDropShadow = true;

            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, {includeDropShadow});
            });

            it('should have drop-shadow as key', function() {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();

              assert.equal(Object.keys(cssFilterObject).includes('drop-shadow'), true);
            });

            it('should have child object with processed key equal to original key', function() {
              const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();
              const childObject = cssFilterObject['drop-shadow'];

              assert.equal(childObject['processed'], childObject['original']);
            });
          });
        });
      });
    });

    describe('when a cssFilter has multiple filter functions', function() {
      const cssFilter = 'filter: function(100) function2(200) function3(300);'

      beforeEach(function () {
        cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
      });

      it('should have number of keys equal to filter functions', function() {
        const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();

        assert.equal(Object.keys(cssFilterObject).length, 3);
      });
    });
  });

  describe('toSVGFilterObject()', function() {
    const cssFilter = 'filter: invert(10%) grayscale(90%) saturate(40%);'

    beforeEach(function () {
      cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
    });

    it('should return object', function() {
      assert.equal(typeof cssFilterToSVGFilter.toSVGFilterObject(), 'object');
    });

    it('should have number of keys equal to keys of toCSSFilterObjects', function() {
      const svgFilterObject = cssFilterToSVGFilter.toSVGFilterObject();
      const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();

      assert.equal(
        Object.keys(svgFilterObject).length,
        Object.keys(cssFilterObject).length,
      );
    });

    it('should have number of keys equal to keys of cssFilterObject', function() {
      const svgFilterObject = cssFilterToSVGFilter.toSVGFilterObject();
      const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();

      assert.equal(
        Object.keys(svgFilterObject).length,
        Object.keys(cssFilterObject).length,
      );
    });

    it('should have values that are de-generalized SVG_FILTER_TEMPLATES', function() {
      const svgFilterObject = cssFilterToSVGFilter.toSVGFilterObject();
      const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();

      const key = 'saturate';
      const processedValue = cssFilterObject[key]['processed'];
      const generalizedSVGFilterTemplate =
        CSSFilterToSVGFilter.SVG_FILTER_TEMPLATES[key]['template'];
      const degeneralizedSVGFilterTemplate =
        generalizedSVGFilterTemplate.replace('[amount]', processedValue);

      assert.equal(svgFilterObject[key], degeneralizedSVGFilterTemplate);
    });

    describe('optional method parameter cssFilterObject', function() {
      describe('when not provided', function() {
        it('should default to calling toCSSFilterObject()', function() {
          const cssFilterObject = cssFilterToSVGFilter.toCSSFilterObject();

          assert.equal(
            cssFilterToSVGFilter.toSVGFilterObject()['invert'],
            cssFilterToSVGFilter.toSVGFilterObject({cssFilterObject})['invert']
          );
        });
      });

      describe('when provided', function() {
        it('should not match toCSSFilterObject()', function() {
          const cssFilterObject = {
            grayscale: {
              original: '50%',
              processed: 0.5
            }
          };

          assert.notEqual(
            cssFilterToSVGFilter.toSVGFilterObject({cssFilterObject})['invert'],
            cssFilterToSVGFilter.toSVGFilterObject()['invert']
          );
        });
      });
    });
  });

  describe('toSVGFilter()', function() {
    const cssFilter = 'filter: invert(50%);'

    beforeEach(function () {
      cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
    });

    it('should return string containing \'<filter\' and \'</filter>\'', function() {
      const svgFilter = cssFilterToSVGFilter.toSVGFilter();

      assert.equal(typeof svgFilter, 'string');
      assert.equal(svgFilter.includes('<filter'), true);
      assert.equal(svgFilter.includes('</filter>'), true);
    });

    describe('optional class parameter filterId', function() {
      const filterId = 'greatId';

      describe('when not provided', function() {
        beforeEach(function () {
          cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, {filterId});
        });

        it('should default to this.filterId', function() {
          assert.equal(
            cssFilterToSVGFilter.toSVGFilter(),
            cssFilterToSVGFilter.toSVGFilter({filterId}),
          );
        });

        describe('this.filterId', function() {
          describe('when not provided', function() {
            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
            });

            it('should not include \'id=\'', function() {
              const svgFilter = cssFilterToSVGFilter.toSVGFilter();

              assert.equal(svgFilter.includes('id='), false);
            });
          });

          describe('when provided', function() {
            beforeEach(function () {
              cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, {filterId});
            });

            it('should include \'<filter id="{filterId}"\'', function() {
              const svgFilter = cssFilterToSVGFilter.toSVGFilter();

              assert.equal(svgFilter.includes(`<filter id="${filterId}"`), true);
            });
          });
        });
      });

      describe('when provided', function() {
        beforeEach(function () {
          cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter, {filterId});
        });

        it('should default to this.filterId', function() {
          assert.equal(
            cssFilterToSVGFilter.toSVGFilter(),
            cssFilterToSVGFilter.toSVGFilter({filterId}),
          );
        });

        it('should include \'<filter id="{filterId}"\'', function() {
          const svgFilter = cssFilterToSVGFilter.toSVGFilter();

          assert.equal(svgFilter.includes(`<filter id="${filterId}"`), true);
        });
      });
    });

    describe('optional method parameter attributes', function() {
      const cssFilter = 'filter: invert(50%);'

      describe('when not provided', function() {
        const defaultAttributes = 'color-interpolation-filters="sRGB"';

        beforeEach(function () {
          cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
        });

        it(`should default to '${defaultAttributes}'`, function() {
          const svgFilter = cssFilterToSVGFilter.toSVGFilter();

          assert.equal(svgFilter.includes(`<filter ${defaultAttributes}>`), true);
        });
      });

      describe('when provided', function() {
        const attributes = 'class="greatClassName"'

        beforeEach(function () {
          cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
        });

        it('should include \'<filter {attributes}>\'', function() {
          const svgFilter = cssFilterToSVGFilter.toSVGFilter({attributes});

          assert.equal(svgFilter.includes(`<filter ${attributes}>`), true);
        });
      });
    });
  });

  describe('toSVG()', function() {
    const cssFilter = 'filter: invert(50%);'

    beforeEach(function () {
      cssFilterToSVGFilter = new CSSFilterToSVGFilter(cssFilter);
    });

    it('should return string containing \'<svg\' and \'</svg>\'', function() {
      const svg = cssFilterToSVGFilter.toSVG();

      assert.equal(typeof svg, 'string');
      assert.equal(svg.includes('<svg'), true);
      assert.equal(svg.includes('</svg>'), true);
    });

    describe('optional method parameter attributes', function() {
      const defaultAttributes = 'width="100%" height="100%"';

      describe('when not provided', function() {
        it(`should default to '${defaultAttributes}'`, function() {
          const svgFilter = cssFilterToSVGFilter.toSVG();

          assert.equal(svgFilter.includes(`<svg ${defaultAttributes}>`), true);
        });
      });

      describe('when provided', function() {
        const attributes = 'class="greatClassName"'

        it('should include \'<svg {attributes}>\'', function() {
          const svg = cssFilterToSVGFilter.toSVG({attributes});

          assert.equal(svg.includes(`<svg ${attributes}>`), true);
        });
      });
    });

    describe('optional class parameter svgFilter', function() {
      describe('when not provided', function() {
        it('should default to calling toSVGFilter()', function() {
          const svgFilter = cssFilterToSVGFilter.toSVGFilter();

          assert.equal(
            cssFilterToSVGFilter.toSVG(),
            cssFilterToSVGFilter.toSVG({svgFilter})
          );
        });
      });

      describe('when provided', function() {
        it('should not match toSVGFilter()', function() {
          const svgFilter= '<filter></filter>';

          assert.notEqual(
            cssFilterToSVGFilter.toSVG({svgFilter}),
            cssFilterToSVGFilter.toSVG()
          );
        });
      });
    });
  });
});
