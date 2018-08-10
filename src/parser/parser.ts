import { Lexer, TokenType } from '../lexer';
import { ErrorMessage } from './error-message';
import { Expression } from './expression';
import { ParserBase } from './parser-base';
import { ResultEvaluator } from './result-evaluator.type';

type UnaryOperator = (n: any) => any;
type BooleanOperator = (l: any, r: any) => any;

const UnaryOperatorMap: { [token: string]: UnaryOperator } = {
  [TokenType.Plus]: n => +n,
  [TokenType.Minus]: n => -n,
  [TokenType.Exclamation]: n => !n
};

const AddOperatorMap: { [token: string]: BooleanOperator } = {
  [TokenType.Plus]: (l, r) => l + r,
  [TokenType.Minus]: (l, r) => l - r
};

const MultiOperatorMap: { [token: string]: BooleanOperator } = {
  [TokenType.Asterisk]: (l, r) => l * r,
  [TokenType.Slash]: (l, r) => l / r,
  [TokenType.Percent]: (l, r) => l % r
};

const BooleanOperatorMap: { [token: string]: BooleanOperator } = {
  [TokenType.Equals]: (l, r) => l === r,
  [TokenType.LessThan]: (l, r) => l < r,
  [TokenType.LessThanEquals]: (l, r) => l <= r,
  [TokenType.GreaterThan]: (l, r) => l > r,
  [TokenType.GreaterThanEquals]: (l, r) => l >= r,
  [TokenType.Pipe]: (l, r) => !!(l || r),
  [TokenType.Ampersand]: (l, r) => !!(l && r)
};

export class Parser extends ParserBase {

  protected parseCore(lexer: Lexer, errors: ErrorMessage[]): Expression {
    return this.parseExpression(lexer, errors)
  };

  parseExpression(lexer: Lexer, errors: ErrorMessage[]): ResultEvaluator {
    const lhs = this.parseSimpleExpression(lexer, errors);

    const operator = BooleanOperatorMap[lexer.peekNextToken().type];
    if (!operator) { return lhs; }
    lexer.getNextToken();

    const rhs = this.parseSimpleExpression(lexer, errors);
    return s => operator(lhs(s), rhs(s));
  }

  parseSimpleExpression(lexer: Lexer, errors: ErrorMessage[]): ResultEvaluator {
    let tokenType = lexer.peekNextToken().type;

    const unaryOp = UnaryOperatorMap[tokenType];

    // Consume unary operator. '+3' for example.
    if (unaryOp) { lexer.getNextToken(); }

    // Parse as a term. Will be a number if we've just consumed the unary token.
    let root: ResultEvaluator = this.parseTerm(lexer, errors);

    // If we had a unary operator, then add it in.
    if (unaryOp) {
      const n = root;
      root = s => unaryOp(n(s));
    }

    tokenType = lexer.peekNextToken().type;
    while (Object.keys(AddOperatorMap).indexOf(tokenType) > -1) {
      const operation: BooleanOperator = AddOperatorMap[tokenType];

      // Consume the operator.
      lexer.getNextToken();

      const l = root;
      const r = this.parseTerm(lexer, errors);
      root = s => operation(l(s), r(s));
      tokenType = lexer.peekNextToken().type;
    }
    return root;
  }

  parseTerm(lexer: Lexer, errors: ErrorMessage[]): ResultEvaluator {
    let root: ResultEvaluator = this.parseFactor(lexer, errors);

    let tokenType = lexer.peekNextToken().type;
    while (Object.keys(MultiOperatorMap).indexOf(tokenType) > -1) {
      const operation: BooleanOperator = MultiOperatorMap[tokenType];

      // Consume the operator.
      lexer.getNextToken();

      const l = root;
      const r = this.parseFactor(lexer, errors);
      root = s => operation(l(s), r(s));
      tokenType = lexer.peekNextToken().type;
    }

    return root;
  }

  parseFactor(lexer: Lexer, errors: ErrorMessage[]): ResultEvaluator {
    const token = lexer.peekNextToken();
    switch (token.type) {
      case TokenType.Identifier:
        const identifier = this.parseDottedIdentifier(lexer, errors);
        if (lexer.peekNextToken().type === TokenType.ParenthesisOpen) {
          return this.parseFunction(lexer, errors, identifier);
        } else {
          return this.parseVariable(lexer, errors, identifier);
        }
      case TokenType.ParenthesisOpen: return this.parseBracketedExpression(lexer, errors);
      case TokenType.Number: return this.parseNumber(lexer, errors);
      default: this.errorToken(errors, TokenType.Number, token);
    }
  }

  parseFunction(lexer: Lexer, errors: ErrorMessage[], name?: string[]): ResultEvaluator {
    const functionName = name || this.parseDottedIdentifier(lexer, errors);

    this.expectAndConsume(lexer, errors, TokenType.ParenthesisOpen)

    const args: ResultEvaluator[] = [];

    // Parse function arguments.
    const token = lexer.peekNextToken();
    if (token.type !== TokenType.ParenthesisClose) {
      args.push(this.parseExpression(lexer, errors));
      while (lexer.peekNextToken().type === TokenType.Comma) {
        lexer.getNextToken(); // Consume the comma.
        args.push(this.parseExpression(lexer, errors));
      }
    }

    this.expectAndConsume(lexer, errors, TokenType.ParenthesisClose);

    return s => {
      const resolvedArgs = args.map(a => a(s));
      return s.resolve(functionName)(...resolvedArgs);
    };
  }

  parseNumber(lexer: Lexer, errors: ErrorMessage[]): ResultEvaluator {
    const numberToken = lexer.getNextToken();
    return () => Number(numberToken.value);
  }

  parseVariable(lexer: Lexer, errors: ErrorMessage[], identifier?: string[]): ResultEvaluator {
    const value = identifier || this.parseDottedIdentifier(lexer, errors);
    return s => s.resolve(value);
  }

  parseBracketedExpression(lexer: Lexer, errors: ErrorMessage[]): ResultEvaluator {
    lexer.getNextToken(); // Consume the opening bracket.
    const root = this.parseExpression(lexer, errors);
    this.expectAndConsume(lexer, errors, TokenType.ParenthesisClose);
    return root;
  }

  parseDottedIdentifier(lexer: Lexer, errors: ErrorMessage[]): string[] {
    const parts: string[] = [];
    parts.push(this.expectAndConsume(lexer, errors, TokenType.Identifier).value);
    while (lexer.peekNextToken().type === TokenType.Period) {
      lexer.getNextToken();
      parts.push(this.expectAndConsume(lexer, errors, TokenType.Identifier).value);
    }
    return parts;
  }
}
