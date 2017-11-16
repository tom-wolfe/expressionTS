import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { ParseResult } from '../../src/parser/parse-result';
import { DefaultResolutionService, ResolutionContext } from '../../src/parser/resolution-service';
import { MockLexer } from '../helpers/mock-lexer';

describe('Parser', () => {
    describe('parseFactor', () => {
        it('can correctly parse a number factor', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, '10')
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);
            expect(exp(new DefaultResolutionService(), new ResolutionContext())).toBe(10);
        });
        it('can correctly parse a function call', () => {
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

            const service = new DefaultResolutionService();
            service.functions = {
                floor: Math.floor
            };
            expect(exp(service, new ResolutionContext())).toBe(10);
        });
        it('can correctly parse a function call with multiple arguments', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'pow'),
                new Token(TokenType.ParenthesisOpen, 5, '('),
                new Token(TokenType.Number, 6, '3'),
                new Token(TokenType.Comma, 7, ','),
                new Token(TokenType.Number, 8, '2'),
                new Token(TokenType.ParenthesisClose, 9, ')')
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);

            const service = new DefaultResolutionService();
            service.functions = {
                pow: Math.pow
            };
            expect(exp(service, new ResolutionContext())).toBe(9);
        });
        it('can correctly parse a variable', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Identifier, 0, 'x')
            ]);
            const parser = new Parser.Parser(lexer);
            const result = new ParseResult();
            const exp = parser.parseFactor(result);
            expect(result.errors.length).toBe(0);

            const service = new DefaultResolutionService();
            service.variables = {
                x: 6
            };
            expect(exp(service, new ResolutionContext())).toBe(6);
        });
        it('can correctly parse a variable as a parameter', () => {
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
            const service = new DefaultResolutionService();
            service.functions = {
                floor: Math.floor
            };
            service.variables = {
                x: 6.5
            };
            expect(exp(service, new ResolutionContext())).toBe(6);
        });
        it('can correctly parse a bracketed expression', () => {
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
            expect(exp(new DefaultResolutionService(), new ResolutionContext())).toBe(10);
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
