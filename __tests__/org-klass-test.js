jest.dontMock('../lib/klass');

describe('Klass', function() {
  var Klass = require('../lib/klass');

  beforeEach(function () {
    this.klass = new Klass();
  });

  it('should have a name', function () {
    expect(this.klass.name).toBe('Klass');
  });
});
