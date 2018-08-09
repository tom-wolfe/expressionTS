import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { MockLexer } from '../helpers/mock-lexer';

describe('Parser', () => {
  describe('parseNumber', () => {
    it('can correctly parse an integer', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '12')
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseNumber(lexer, errors);
      expect(exp(new Parser.DefaultResolutionContext())).toBe(12);
    });
    it('can correctly parse a real number', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '12.56')
      ]);
      const parser = new Parser.Parser();
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseNumber(lexer, errors);
      expect(exp(new Parser.DefaultResolutionContext())).toBe(12.56);
    });
  });
});
