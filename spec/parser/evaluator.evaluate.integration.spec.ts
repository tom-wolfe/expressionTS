import { Token, TokenType } from '../../src/lexer';
import * as Parser from '../../src/parser';
import { MockLexer } from '../helpers/mock-lexer';

describe('Evaluator (integration)', () => {
    describe('evaluate', () => {
        it('Can parse and evaluate a simple expression.', () => {
            const parser = new Parser.Parser('1 + 1');
            const result = parser.parse();
            expect(result.errors.length).toBe(0);
            expect(result.evaluator.evaluate()).toBe(2);
        });
    });
});
