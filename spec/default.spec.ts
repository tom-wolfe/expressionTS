describe('Hello World', () => {
  it('should not throw', function () {
    expect(() => {
      console.log('Hello World!');
    }).not.toThrow();
  });
});
