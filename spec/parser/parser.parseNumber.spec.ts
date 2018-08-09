import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { ParseResult } from '../../src/parser/parse-result';
import { DefaultResolutionService, ResolutionContext } from '../../src/parser/resolution-service';
import { MockLexer } from '../helpers/mock-lexer';

describe('Parser', () => {
  describe('constructor', () => {
    it('does not throw.', () => {
      expect(() => {
        const parser = new Parser.Parser('');
      }).not.toThrow();
    });
  });
  describe('parseNumber', () => {
    it('can correctly parse an integer', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '12')
      ]);
      const parser = new Parser.Parser(lexer);
      const result = new ParseResult();
      const exp = parser.parseNumber(result);
      expect(exp(new DefaultResolutionService(), new ResolutionContext())).toBe(12);
    });
    it('can correctly parse a real number', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '12.56')
      ]);
      const parser = new Parser.Parser(lexer);
      const result = new ParseResult();
      const exp = parser.parseNumber(result);
      expect(exp(new DefaultResolutionService(), new ResolutionContext())).toBe(12.56);
    });
  });
});
