import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { MockLexer } from '../helpers/mock-lexer';

describe('Parser', () => {
  describe('parseDottedIdentifier', () => {
    it('can correctly parse a dotted identifier', () => {
      const lexer = new MockLexer([
        new Token(TokenType.Identifier, 0, 'foo'),
        new Token(TokenType.Period, 3, '.'),
        new Token(TokenType.Identifier, 4, 'bar'),
      ]);
      const parser = new Parser.Parser(lexer);
      const errors: Parser.ErrorMessage[] = [];
      const exp = parser.parseDottedIdentifier(errors);
      expect(errors.length).toBe(0);
      expect(exp.length).toBe(2);
      expect(exp[0]).toBe('foo');
      expect(exp[1]).toBe('bar');
    });
  });
});
