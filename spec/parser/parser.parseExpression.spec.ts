import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { MockLexer } from '../helpers/mock-lexer';

describe('Parser', () => {
  describe('parseExpression', () => {
    it('can correctly parse a simple >', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '10'),
        new Token(TokenType.GreaterThan, 2, '>'),
        new Token(TokenType.Number, 3, '6')
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseExpression(lexer, errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(true);
    });
    it('can correctly parse a simple <', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '10'),
        new Token(TokenType.LessThan, 2, '<'),
        new Token(TokenType.Number, 3, '6')
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseExpression(lexer, errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(false);
    });
    it('can correctly parse a simple <=', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '10'),
        new Token(TokenType.LessThanEquals, 2, '<='),
        new Token(TokenType.Number, 3, '6')
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseExpression(lexer, errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(false);
    });
    it('can correctly parse a simple >=', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '10'),
        new Token(TokenType.GreaterThanEquals, 2, '>='),
        new Token(TokenType.Number, 4, '6')
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseExpression(lexer, errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(true);
    });
    it('can correctly parse a simple &', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '0'),
        new Token(TokenType.Ampersand, 1, '&'),
        new Token(TokenType.Number, 2, '6')
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseExpression(lexer, errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(false);
    });
    it('can correctly parse a simple |', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '0'),
        new Token(TokenType.Pipe, 1, '|'),
        new Token(TokenType.Number, 2, '6')
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseExpression(lexer, errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(true);
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
      const exp = parser.parseExpression(lexer, errors);
      expect(errors.length).toBe(0);
      expect(exp()).toBe(52);
    });
  });
});
