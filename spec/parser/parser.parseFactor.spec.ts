import { ParseResult } from '../../src/parser/parse-result';
import { NodeType } from '../../src/ast/node-type';
import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
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
            expect(exp.type).toBe(NodeType.Number);
            expect(exp.getChildCount()).toBe(0);
            expect(exp.getAttribute('value')).toBe(10);
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
            expect(exp.type).toBe(NodeType.Function);
            expect(exp.getChildCount()).toBe(1);
            expect(exp.getChild(0).type).toBe(NodeType.Number);
            expect(exp.getChild(0).getAttribute('value')).toBe(10);
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
            expect(exp.type).toBe(NodeType.Add);
            expect(exp.getChildCount()).toBe(2);
            expect(exp.getChild(0).type).toBe(NodeType.Number);
            expect(exp.getChild(0).getAttribute('value')).toBe(6);
            expect(exp.getChild(1).type).toBe(NodeType.Number);
            expect(exp.getChild(1).getAttribute('value')).toBe(4);
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
