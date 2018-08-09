import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { ParseResult } from '../../src/parser/parse-result';
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
            const result = new ParseResult();
            const exp = parser.parseDottedIdentifier(result);
            expect(result.errors.length).toBe(0);
            expect(exp.length).toBe(2);
            expect(exp[0]).toBe('foo');
            expect(exp[1]).toBe('bar');
        });
    });
});
