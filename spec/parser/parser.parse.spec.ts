import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { MockLexer } from '../helpers/mock-lexer';

describe('Parser', () => {
    describe('parse', () => {
        it('correctly sets the evaluator.', () => {
            const lexer = new MockLexer([
                new Token(TokenType.Number, 0, '6'),
                new Token(TokenType.Asterisk, 1, '*'),
                new Token(TokenType.Number, 2, '4'),
            ]);
            const parser = new Parser.Parser(lexer);
            const result = parser.parse();
            expect(result.errors.length).toBe(0);
            expect(result.evaluator).not.toBeNull();
        });
    });
});
