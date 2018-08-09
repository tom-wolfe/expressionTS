import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { MockLexer } from '../helpers/mock-lexer';

describe('Parser', () => {
  describe('parseExpression', () => {
    it('can correctly parse a simple greater than', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '10'),
        new Token(TokenType.GreaterThan, 2, '>'),
        new Token(TokenType.Number, 3, '6')
      ]);
      const parser = new Parser.Parser(lexer);
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseExpression(errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(true);
    });
    it('can correctly parse a simple less than or equal to', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '10'),
        new Token(TokenType.LessThanEquals, 2, '<='),
        new Token(TokenType.Number, 3, '6')
      ]);
      const parser = new Parser.Parser(lexer);
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseExpression(errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(false);
    });
    it('correctly handles operator precedence (10 * 5 + 2)', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '10'),
        new Token(TokenType.Asterisk, 2, '*'),
        new Token(TokenType.Number, 3, '5'),
        new Token(TokenType.Plus, 4, '+'),
        new Token(TokenType.Number, 5, '2'),
      ]);
      const parser = new Parser.Parser(lexer);
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseExpression(errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(52);
    });
  });
});
