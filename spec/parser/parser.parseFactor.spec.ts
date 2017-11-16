import { EvaluationContext } from '../../src/parser/evaluation-context';
import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { ParseResult } from '../../src/parser/parse-result';
import { MockLexer } from '../helpers/mock-lexer';

describe('Parser', () => {
    describe('parseFactor', () => {
        it('can correctly identify a number factor', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, '10')
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);
            expect(exp(null)).toBe(10);
        });
        it('can correctly identify a function call', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'floor'),
                new Token(TokenType.ParenthesisOpen, 5, '('),
                new Token(TokenType.Number, 6, '10'),
                new Token(TokenType.ParenthesisClose, 8, ')')
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);

            const context = new EvaluationContext();
            context.functions = {
                floor: Math.floor
            };
            expect(exp(context)).toBe(10);
        });
        it('can correctly identify a variable', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'x')
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);

            const context = new EvaluationContext();
            context.variables = {
                x: 6
            };
            expect(exp(context)).toBe(6);
        });
        it('can correctly identify a variable as a parameter', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'floor'),
                new Token(TokenType.ParenthesisOpen, 5, '('),
                new Token(TokenType.Identifier, 6, 'x'),
                new Token(TokenType.ParenthesisClose, 8, ')')
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);
            const context = new EvaluationContext();
            context.functions = {
                floor: Math.floor
            };
            context.variables = {
                x: 6.5
            };
            expect(exp(context)).toBe(6);
        });
        it('can correctly identify a bracketed expression', () => {
            const lexer = new MockLexer([
                new Token(TokenType.ParenthesisOpen, 0, '('),
                new Token(TokenType.Number, 1, '6'),
                new Token(TokenType.Plus, 2, '+'),
                new Token(TokenType.Number, 3, '4'),
                new Token(TokenType.ParenthesisClose, 4, ')'),
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);
            expect(exp(null)).toBe(10);
        });
        it('throws on unexpected token type.', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Comma, 5, ','),
                new Token(TokenType.Number, 6, '10'),
            ]);
            const parser = new Parser.Parser(lexer);

            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBeGreaterThanOrEqual(1);
        });
    });
});
