import { IEvaluationContext } from './evaluation-context.interface';
import { ILexer, TokenType } from '../lexer';
import { ParseResult } from './parse-result';
import { ParserBase } from './parser-base';
import { ResultEvaluator } from './result-evaluator';

const AddOperatorMap: { [token: string]: (l: number, r: number) => number } = {};
AddOperatorMap[TokenType.Plus] = (l, r) => l + r;
AddOperatorMap[TokenType.Minus] = (l, r) => l - r;

const MultiOperatorMap: { [token: string]: (l: number, r: number) => number } = {};
MultiOperatorMap[TokenType.DoubleAsterisk] = (l, r) => Math.pow(l, r);
MultiOperatorMap[TokenType.Asterisk] = (l, r) => l * r;
MultiOperatorMap[TokenType.Slash] = (l, r) => l / r;
MultiOperatorMap[TokenType.Percent] = (l, r) => l % r;

export class Parser extends ParserBase {
    constructor(input: ILexer | string) { super(input); }

    parse(): ParseResult {
        const result = new ParseResult();
        result.evaluator = this.parseExpression(result);
        return result;
    }

    parseExpression(result: ParseResult): ResultEvaluator {
        let tokenType = this.lexer.peekNextToken().type;

        // Consume unary operator '+3' for example.
        if (Object.keys(AddOperatorMap).indexOf(tokenType.toString()) > -1) {
            this.lexer.getNextToken();
        }

        // Parse as a term. Will be a number if we've just consumed the unary token.
        let root: ResultEvaluator = this.parseTerm(result);

        // If negate, then flip the sign. Otherwise no need.
        if (tokenType === TokenType.Minus) {
            const n = root;
            root = (e: IEvaluationContext) => -(n(e));
        }

        tokenType = this.lexer.peekNextToken().type;
        while (Object.keys(AddOperatorMap).indexOf(tokenType.toString()) > -1) {
            const operation = AddOperatorMap[tokenType];

            // Consume the operator.
            this.lexer.getNextToken();

            const l = root;
            const r = this.parseTerm(result);
            root = e => operation(l(e), r(e));
            tokenType = this.lexer.peekNextToken().type;
        }
        return root;
    }

    parseTerm(result: ParseResult): ResultEvaluator {
        let root: ResultEvaluator = this.parseFactor(result);

        let tokenType = this.lexer.peekNextToken().type;
        while (Object.keys(MultiOperatorMap).indexOf(tokenType.toString()) > -1) {
            const operation = MultiOperatorMap[tokenType];

            // Consume the operator.
            this.lexer.getNextToken();

            const l = root;
            const r = this.parseFactor(result);
            root = (e) => operation(l(e), r(e));
            tokenType = this.lexer.peekNextToken().type;
        }

        return root;
    }

    parseFactor(result: ParseResult): ResultEvaluator {
        const token = this.lexer.peekNextToken();
        switch (token.type) {
            case TokenType.Identifier:
                const identifier = this.lexer.getNextToken().value;
                if (this.lexer.peekNextToken().type === TokenType.ParenthesisOpen) {
                    return this.parseFunction(result, identifier);
                } else {
                    return this.parseVariable(result, identifier);
                }
            case TokenType.ParenthesisOpen: return this.parseBracketedExpression(result);
            case TokenType.Number: return this.parseNumber(result);
            default: this.errorToken(result, TokenType.Number, token);
        }
    }

    parseFunction(result: ParseResult, name?: string): ResultEvaluator {
        const functionName = name || this.expectAndConsume(result, TokenType.Identifier).value;

        this.expectAndConsume(result, TokenType.ParenthesisOpen)

        const args: ResultEvaluator[] = [];

        // Parse function arguments.
        const token = this.lexer.peekNextToken();
        if (token.type !== TokenType.ParenthesisClose) {
            args.push(this.parseExpression(result));
            while (this.lexer.peekNextToken().type === TokenType.Comma) {
                this.lexer.getNextToken(); // Consume the comma.
                args.push(this.parseExpression(result));
            }
        }

        this.expectAndConsume(result, TokenType.ParenthesisClose);

        return (e: IEvaluationContext) => e.evaluateFunction(functionName)(...(args.map(a => a(e))));
    }

    parseNumber(result: ParseResult): ResultEvaluator {
        const numberToken = this.lexer.getNextToken();
        return (e: IEvaluationContext) => Number(numberToken.value);
    }

    parseVariable(result: ParseResult, identifier?: string): ResultEvaluator {
        const value = identifier || this.lexer.getNextToken().value;
        return (e: IEvaluationContext) => e.evaluateVariable(value);
    }

    parseBracketedExpression(result: ParseResult): ResultEvaluator {
        this.lexer.getNextToken(); // Consume the opening bracket.
        const root = this.parseExpression(result);
        this.expectAndConsume(result, TokenType.ParenthesisClose);
        return root;
    }
}
