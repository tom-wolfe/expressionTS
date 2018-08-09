import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { MockLexer } from '../helpers/mock-lexer';

describe('Parser', () => {
  describe('parseSimpleExpression', () => {
    it('can correctly parse a simple addition', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '10'),
        new Token(TokenType.Plus, 2, '+'),
        new Token(TokenType.Number, 3, '6')
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseSimpleExpression(lexer, errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(16);
    });
    it('can correctly parse a simple subtraction', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '10'),
        new Token(TokenType.Minus, 2, '-'),
        new Token(TokenType.Number, 3, '6')
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseSimpleExpression(lexer, errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(4);
    });
    it('can correctly parse a simple negation', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Minus, 0, '-'),
        new Token(TokenType.Number, 1, '4')
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseSimpleExpression(lexer, errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(-4);
    });
    it('can correctly parse multiple operators', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '4'),
        new Token(TokenType.Plus, 1, '+'),
        new Token(TokenType.Number, 2, '3'),
        new Token(TokenType.Minus, 3, '-'),
        new Token(TokenType.Number, 4, '1')
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseSimpleExpression(lexer, errors);
      expect(exp()).toBe(6);
    });
    it('correctly handles operator precedence (10 * 5 + 2)', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '10'),
        new Token(TokenType.Asterisk, 2, '*'),
        new Token(TokenType.Number, 3, '5'),
        new Token(TokenType.Plus, 4, '+'),
        new Token(TokenType.Number, 5, '2'),
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseSimpleExpression(lexer, errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(52);
    });
  });
});
