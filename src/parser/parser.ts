import { Lexer, TokenType } from '../lexer';
import { Evaluator } from './evaluator';
import { ParseResult } from './parse-result';
import { ParserBase } from './parser-base';
import { ResolutionService } from './resolution-service';
import { ResultEvaluator } from './result-evaluator.type';

type BooleanOperator = (l: any, r: any) => any;

const AddOperatorMap: { [token: string]: BooleanOperator } = {};
AddOperatorMap[TokenType.Plus] = (l, r) => l + r;
AddOperatorMap[TokenType.Minus] = (l, r) => l - r;

const MultiOperatorMap: { [token: string]: BooleanOperator } = {};
MultiOperatorMap[TokenType.DoubleAsterisk] = (l, r) => Math.pow(l, r);
MultiOperatorMap[TokenType.Asterisk] = (l, r) => l * r;
MultiOperatorMap[TokenType.Slash] = (l, r) => l / r;
MultiOperatorMap[TokenType.Percent] = (l, r) => l % r;

export class Parser extends ParserBase {
    constructor(input: Lexer | string) { super(input); }

    parse(service?: ResolutionService): ParseResult {
        const result = new ParseResult();
        const exp = this.parseExpression(result);
        result.evaluator = new Evaluator(exp, service);
        return result;
    }

    parseExpression(result: ParseResult): ResultEvaluator {
        let tokenType = this.lexer.peekNextToken().type;

        // Consume unary operator. '+3' for example.
        if (Object.keys(AddOperatorMap).indexOf(tokenType.toString()) > -1) {
            this.lexer.getNextToken();
        }

        // Parse as a term. Will be a number if we've just consumed the unary token.
        let root: ResultEvaluator = this.parseTerm(result);

        // If negate, then flip the sign. Otherwise no need.
        if (tokenType === TokenType.Minus) {
            const n = root;
            root = (s, c) => -(n(s, c));
        }

        tokenType = this.lexer.peekNextToken().type;
        while (Object.keys(AddOperatorMap).indexOf(tokenType.toString()) > -1) {
            const operation: BooleanOperator = AddOperatorMap[tokenType];

            // Consume the operator.
            this.lexer.getNextToken();

            const l = root;
            const r = this.parseTerm(result);
            root = (s, c) => operation(l(s, c), r(s, c));
            tokenType = this.lexer.peekNextToken().type;
        }
        return root;
    }

    parseTerm(result: ParseResult): ResultEvaluator {
        let root: ResultEvaluator = this.parseFactor(result);

        let tokenType = this.lexer.peekNextToken().type;
        while (Object.keys(MultiOperatorMap).indexOf(tokenType.toString()) > -1) {
            const operation: BooleanOperator = MultiOperatorMap[tokenType];

            // Consume the operator.
            this.lexer.getNextToken();

            const l = root;
            const r = this.parseFactor(result);
            root = (s, c) => operation(l(s, c), r(s, c));
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

        return (s, c) => {
            const prevFunc = c.functionName;
            c.functionName = functionName;
            const resolvedArgs = args.map(a => a(s, c));
            const func = s.resolveFunction(functionName, c)(...resolvedArgs);
            c.functionName = prevFunc;
            return func;
        };
    }

    parseNumber(result: ParseResult): ResultEvaluator {
        const numberToken = this.lexer.getNextToken();
        return (s, c) => Number(numberToken.value);
    }

    parseVariable(result: ParseResult, identifier?: string): ResultEvaluator {
        const value = identifier || this.lexer.getNextToken().value;
        return (s, c) => s.resolveVariable(value, c);
    }

    parseBracketedExpression(result: ParseResult): ResultEvaluator {
        this.lexer.getNextToken(); // Consume the opening bracket.
        const root = this.parseExpression(result);
        this.expectAndConsume(result, TokenType.ParenthesisClose);
        return root;
    }
}
