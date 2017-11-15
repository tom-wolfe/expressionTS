import * as Ast from '../ast';
import { ILexer, TokenType } from '../lexer';
import { ParseResult } from './parse-result';
import { ParserBase } from './parser-base';

const BooleanOperatorMap: { [token: string]: Ast.NodeType } = {};
BooleanOperatorMap[TokenType.Equals] = Ast.NodeType.Equal;
BooleanOperatorMap[TokenType.Greater] = Ast.NodeType.Greater;
BooleanOperatorMap[TokenType.Less] = Ast.NodeType.Less;
BooleanOperatorMap[TokenType.GreaterOrEqual] = Ast.NodeType.GreaterOrEqual;
BooleanOperatorMap[TokenType.LessOrEqual] = Ast.NodeType.LessOrEqual;

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
        let root = this.parseSimpleExpression(result);
        const tokenType = this.lexer.peekNextToken().type;
        if (Object.keys(BooleanOperatorMap).indexOf(tokenType.toString()) > -1) {
            const newRoot = Ast.Factory.create(BooleanOperatorMap[tokenType]);
            this.lexer.getNextToken();
            newRoot.addChild(root);
            newRoot.addChild(this.parseSimpleExpression(result));
            root = newRoot;
        }
        return root;
    }

    parseSimpleExpression(result: ParseResult): Ast.ExpressionNode {
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
                root = this.parseFunction(result);
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

    parseSimpleFactor(result: ParseResult): Ast.ExpressionNode {
        const token = this.lexer.peekNextToken();
        switch (token.type) {
            case TokenType.Number: return this.parseNumber(result);
            case TokenType.ParenthesisOpen: return this.parseBracketedExpression(result);
            default: this.errorToken(result, TokenType.Number, token);
        }
    }

    parseFunction(result: ParseResult): Ast.ExpressionNode {
        const functionName = this.expectAndConsume(result, TokenType.Identifier);
        const root = Ast.Factory.create(Ast.NodeType.Function, functionName.value);

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

    parseBracketedExpression(result: ParseResult): Ast.ExpressionNode {
        this.lexer.getNextToken(); // Consume the opening bracket.
        const root = this.parseExpression(result);
        this.expectAndConsume(result, TokenType.ParenthesisClose);
        return root;
    }
}
