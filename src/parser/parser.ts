import * as Ast from '../ast';
import { ILexer, TokenType } from '../lexer';
import { ParseResult } from './parse-result';
import { ParserBase } from './parser-base';

const AddOperatorMap: { [token: string]: Ast.NodeType } = {};
AddOperatorMap[TokenType.Plus] = Ast.NodeType.Add;
AddOperatorMap[TokenType.Minus] = Ast.NodeType.Subtract;

const MultiOperatorMap: { [token: string]: Ast.NodeType } = {};
MultiOperatorMap[TokenType.DoubleAsterisk] = Ast.NodeType.Exponent;
MultiOperatorMap[TokenType.Asterisk] = Ast.NodeType.Multiply;
MultiOperatorMap[TokenType.Slash] = Ast.NodeType.Divide;
MultiOperatorMap[TokenType.Percent] = Ast.NodeType.Modulo;

export class Parser extends ParserBase {
    constructor(input: ILexer | string) { super(input); }

    parse(): ParseResult {
        const result = new ParseResult();
        result.root = this.parseExpression(result);
        return result;
    }

    parseExpression(result: ParseResult): Ast.ExpressionNode {
        let tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(AddOperatorMap).indexOf(tokenType.toString()) > -1) {
            this.lexer.getNextToken();
        }

        let root = this.parseTerm(result);

        if (tokenType === TokenType.Minus) {
            const negateNode = Ast.Factory.create(Ast.NodeType.Negate);
            negateNode.addChild(root);
            root = negateNode;
        }

        tokenType = this.lexer.peekNextToken().type;
        while (Object.keys(AddOperatorMap).indexOf(tokenType.toString()) > -1) {
            const newRoot = Ast.Factory.create(AddOperatorMap[tokenType]);
            newRoot.addChild(root);

            // Consume the operator.
            this.lexer.getNextToken();

            newRoot.addChild(this.parseTerm(result));

            root = newRoot;
            tokenType = this.lexer.peekNextToken().type;
        }
        return root;
    }

    parseTerm(result: ParseResult): Ast.ExpressionNode {
        let root: Ast.ExpressionNode = this.parseFactor(result);

        let tokenType = this.lexer.peekNextToken().type;
        while (Object.keys(MultiOperatorMap).indexOf(tokenType.toString()) > -1) {
            const newRoot = Ast.Factory.create(MultiOperatorMap[tokenType]);
            newRoot.addChild(root);

            // Consume the operator.
            this.lexer.getNextToken();
            newRoot.addChild(this.parseFactor(result));

            root = newRoot;
            tokenType = this.lexer.peekNextToken().type;
        }

        return root;
    }

    parseFactor(result: ParseResult): Ast.ExpressionNode {
        let root: Ast.ExpressionNode;
        const token = this.lexer.peekNextToken();
        switch (token.type) {
            case TokenType.Identifier:
                const identifier = this.lexer.getNextToken().value;
                if (this.lexer.peekNextToken().type === TokenType.ParenthesisOpen) {
                    root = this.parseFunction(result, identifier);
                } else {
                    root = this.parseVariable(result, identifier);
                }
                break;
            case TokenType.ParenthesisOpen:
                root = this.parseBracketedExpression(result);
                break;
            case TokenType.Number:
                root = this.parseNumber(result);
                break;
            default: this.errorToken(result, TokenType.Number, token);
        }
        return root;
    }

    parseFunction(result: ParseResult, name?: string): Ast.ExpressionNode {
        const functionName = name || this.expectAndConsume(result, TokenType.Identifier).value;
        const root = Ast.Factory.create(Ast.NodeType.Function, functionName);

        this.expectAndConsume(result, TokenType.ParenthesisOpen)

        // Parse function arguments.
        const token = this.lexer.peekNextToken();
        if (token.type !== TokenType.ParenthesisClose) {
            root.addChild(this.parseExpression(result));
            while (this.lexer.peekNextToken().type === TokenType.Comma) {
                this.lexer.getNextToken(); // Consume the comma.
                root.addChild(this.parseExpression(result));
            }
        }

        this.expectAndConsume(result, TokenType.ParenthesisClose);

        return root;
    }

    parseNumber(result: ParseResult): Ast.ExpressionNode {
        const numberToken = this.lexer.getNextToken();
        return Ast.Factory.create(Ast.NodeType.Number, Number(numberToken.value));
    }

    parseVariable(result: ParseResult, identifier?: string): Ast.ExpressionNode {
        const value = identifier || this.lexer.getNextToken().value;
        return Ast.Factory.create(Ast.NodeType.Variable, value);
    }

    parseBracketedExpression(result: ParseResult): Ast.ExpressionNode {
        this.lexer.getNextToken(); // Consume the opening bracket.
        const root = this.parseExpression(result);
        this.expectAndConsume(result, TokenType.ParenthesisClose);
        return root;
    }
}
