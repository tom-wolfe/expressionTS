import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { ParseResult } from '../../src/parser/parse-result';
import { DefaultResolutionService, ResolutionContext } from '../../src/parser/resolution-service';
import { MockLexer } from '../helpers/mock-lexer';

describe('Parser', () => {
  describe('parseTerm', () => {
    it('can correctly identify a multiplication', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '6'),
        new Token(TokenType.Asterisk, 1, '*'),
        new Token(TokenType.Number, 2, '4'),
      ]);
      const parser = new Parser.Parser(lexer);
      const result = new ParseResult();
      const exp = parser.parseTerm(result);
      expect(result.errors.length).toBe(0);
      expect(exp(new DefaultResolutionService(), new ResolutionContext())).toBe(24);
    });
    it('can correctly identify a division', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '6'),
        new Token(TokenType.Slash, 1, '/'),
        new Token(TokenType.Number, 2, '4'),
      ]);
      const parser = new Parser.Parser(lexer);
      const result = new ParseResult();
      const exp = parser.parseTerm(result);
      expect(result.errors.length).toBe(0);
      expect(exp(new DefaultResolutionService(), new ResolutionContext())).toBe(1.5);
    });
    it('can correctly identify a modulo', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '6'),
        new Token(TokenType.Percent, 1, '%'),
        new Token(TokenType.Number, 2, '4'),
      ]);
      const parser = new Parser.Parser(lexer);
      const result = new ParseResult();
      const exp = parser.parseTerm(result);
      expect(result.errors.length).toBe(0);
      expect(exp(new DefaultResolutionService(), new ResolutionContext())).toBe(2);
    });
    it('can correctly parse multiple operators', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Number, 0, '4'),
        new Token(TokenType.Asterisk, 1, '*'),
        new Token(TokenType.Number, 2, '3'),
        new Token(TokenType.Slash, 3, '/'),
        new Token(TokenType.Number, 4, '1')
      ]);
      const parser = new Parser.Parser(lexer);
      const result = new ParseResult();
      const exp = parser.parseTerm(result);
      expect(result.errors.length).toBe(0);
      expect(exp(new DefaultResolutionService(), new ResolutionContext())).toBe(12);
    });
  });
});
