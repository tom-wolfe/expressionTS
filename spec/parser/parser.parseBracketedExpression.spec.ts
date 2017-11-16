import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { MockLexer } from '../helpers/mock-lexer';

describe('Parser', () => {
    describe('parseBracketedExpression', () => {
        it('can correctly parse a simple expression', () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, 0, '('),
                new Token(TokenType.Number, 1, '10'),
                new Token(TokenType.ParenthesisClose, 3, ')')
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new Parser.ParseResult();
            const exp = parser.parseBracketedExpression(result);
            expect(result.errors.length).toBe(0);
            expect(exp(null)).toBe(10);
        });
        it('can correctly parse an addition', () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, 0, '('),
                new Token(TokenType.Number, 1, '10'),
                new Token(TokenType.Plus, 3, '+'),
                new Token(TokenType.Number, 4, '6'),
                new Token(TokenType.ParenthesisClose, 5, ')'),
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new Parser.ParseResult();
            const exp = parser.parseBracketedExpression(result);
            expect(result.errors.length).toBe(0);
            expect(exp(null)).toBe(16);
        });
        it('throws on missing closing bracket', () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, 0, '('),
                new Token(TokenType.Number, 1, '10'),
                new Token(TokenType.Plus, 3, '+'),
                new Token(TokenType.Number, 4, '6')
            ]);
            const parser = new Parser.Parser(lexer);

            const result = new Parser.ParseResult();
            const exp = parser.parseBracketedExpression(result);
            expect(result.errors.length).toBeGreaterThanOrEqual(1);
        });
    });
});
