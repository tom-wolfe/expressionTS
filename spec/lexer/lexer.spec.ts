import * as Lexer from '../../src/lexer';
import { StringCharacterStream } from '../../src/lexer/string-character-stream';

describe('DefaultLexer', () => {
  const input = 'floor(4*6/2+5*10/2+4)'
  describe('constructor', () => {
    it('does not throw for string input.', function () {
      expect(() => {
        const lexer = new Lexer.DefaultLexer(input);
      }).not.toThrow();
    });
    it('does not throw for stream input.', function () {
      expect(() => {
        const lexer = new Lexer.DefaultLexer(new StringCharacterStream(input));
      }).not.toThrow();
    });
    it('throws for invalid input.', function () {
      expect(() => {
        const lexer = new Lexer.DefaultLexer(6 as any);
      }).toThrow();
    });
  });
  describe('getNextToken', () => {
    it('last token is a terminator', () => {
      const lexer = new Lexer.DefaultLexer('');
      const token = lexer.getNextToken();
      expect(token).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 0));
    });
    it('returns correct tokens (simple)', () => {
      const inputSimple = 'floor(4*6)';
      const lexer = new Lexer.DefaultLexer(inputSimple);
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 0, 'floor'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, '('));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 6, '4'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Asterisk, 7, '*'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 8, '6'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, 9, ')'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 10));
    });
    it('returns correct tokens (simple)', () => {
      const inputSimple = '4<=6)';
      const lexer = new Lexer.DefaultLexer(inputSimple);
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 0, '4'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.LessThanEquals, 1, '<='));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 3, '6'));
    });
    it('returns correct tokens (simple)', () => {
      const inputSimple = '4>6)';
      const lexer = new Lexer.DefaultLexer(inputSimple);
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 0, '4'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.GreaterThan, 1, '>'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 2, '6'));
    });
    it('returns correct tokens (simple)', () => {
      const inputSimple = 'floor(x+y)';
      const lexer = new Lexer.DefaultLexer(inputSimple);
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 0, 'floor'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, '('));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 6, 'x'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 7, '+'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 8, 'y'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, 9, ')'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 10));
    });
    it('returns correct tokens (complex)', () => {
      const lexer = new Lexer.DefaultLexer(input); // floor(4*6/2+5*10/2+4)
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 0, 'floor'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, '('));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 6, '4'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Asterisk, 7, '*'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 8, '6'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Slash, 9, '/'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 10, '2'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 11, '+'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 12, '5'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Asterisk, 13, '*'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 14, '10'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Slash, 16, '/'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 17, '2'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 18, '+'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 19, '4'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, 20, ')'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 21));
    });
    it('interprets remaining operators correctly', () => {
      const lexer = new Lexer.DefaultLexer('5%8-2+pow(10,2)');
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 0, '5'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Percent, 1, '%'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 2, '8'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Minus, 3, '-'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 4, '2'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 5, '+'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 6, 'pow'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 9, '('));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 10, '10'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Comma, 12, ','));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 13, '2'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisClose, 14, ')'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 15));
    });
    it('interprets a floating point number correctly', () => {
      const lexer = new Lexer.DefaultLexer('2.23');
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 0, '2.23'));
    });
    it('throws on unrecognized tokens', () => {
      const lexer = new Lexer.DefaultLexer('test_face');
      lexer.getNextToken();
      expect(() => { lexer.getNextToken() }).toThrow();
    });
    it('skips over whitespace.', () => {
      const lexer = new Lexer.DefaultLexer('2  d\t10 \t + \t\t 3');
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 0, '2'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Identifier, 3, 'd'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 5, '10'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Plus, 10, '+'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 15, '3'));
      expect(lexer.getNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Terminator, 16));
    });
  });
  describe('peekNextToken', () => {
    it('gives next token without cycling through.', () => {
      const lexer = new Lexer.DefaultLexer(input);
      lexer.getNextToken();
      expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, '('));
      expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.ParenthesisOpen, 5, '('));
      lexer.getNextToken();
      expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 6, '4'));
      lexer.getNextToken();
      lexer.getNextToken();
      expect(lexer.peekNextToken()).toEqual(new Lexer.Token(Lexer.TokenType.Number, 8, '6'));
    });
  });
});
