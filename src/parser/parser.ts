import { Lexer, TokenType } from '../lexer';
import { Evaluator } from './evaluator';
import { ParseResult } from './parse-result';
import { ParserBase } from './parser-base';
import { ResolutionService } from './resolution-service';
import { ResultEvaluator } from './result-evaluator.type';

type UnaryOperator = (n: any) => any;
type BooleanOperator = (l: any, r: any) => any;

const UnaryOperatorMap: { [token: string]: UnaryOperator } = {
  [TokenType.Plus]: n => +n,
  [TokenType.Minus]: n => -n,
  [TokenType.Exclamation]: n => !n,
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
  [TokenType.Pipe]: (l, r) => l || r,
  [TokenType.Ampersand]: (l, r) => l && r
};

export class Parser extends ParserBase {
  constructor(input: Lexer | string) { super(input); }

  parse(service?: ResolutionService): ParseResult {
    const result = new ParseResult();
    const exp = this.parseExpression(result);
    result.evaluator = new Evaluator(exp, service);
    return result;
  }

  parseExpression(result: ParseResult): ResultEvaluator {
    const lhs = this.parseSimpleExpression(result);

    const operator = BooleanOperatorMap[this.lexer.peekNextToken().type];
    if (!operator) { return lhs; }
    this.lexer.getNextToken();

    const rhs = this.parseSimpleExpression(result);
    return (s, c) => operator(lhs(s, c), rhs(s, c));
  }

  parseSimpleExpression(result: ParseResult): ResultEvaluator {
    let tokenType = this.lexer.peekNextToken().type;

    const unaryOp = UnaryOperatorMap[tokenType];

    // Consume unary operator. '+3' for example.
    if (unaryOp) { this.lexer.getNextToken(); }

    // Parse as a term. Will be a number if we've just consumed the unary token.
    let root: ResultEvaluator = this.parseTerm(result);

    // If we had a unary operator, then add it in.
    if (unaryOp) {
      const n = root;
      root = (s, c) => unaryOp(n(s, c));
    }

    tokenType = this.lexer.peekNextToken().type;
    while (Object.keys(AddOperatorMap).indexOf(tokenType) > -1) {
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
    while (Object.keys(MultiOperatorMap).indexOf(tokenType) > -1) {
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
        const identifier = this.parseDottedIdentifier(result);
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

  parseFunction(result: ParseResult, name?: string[]): ResultEvaluator {
    const functionName = name || this.parseDottedIdentifier(result);

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
      const func = s.resolve(functionName, c)(...resolvedArgs);
      c.functionName = prevFunc;
      return func;
    };
  }

  parseNumber(result: ParseResult): ResultEvaluator {
    const numberToken = this.lexer.getNextToken();
    return (s, c) => Number(numberToken.value);
  }

  parseVariable(result: ParseResult, identifier?: string[]): ResultEvaluator {
    const value = identifier || this.parseDottedIdentifier(result);
    return (s, c) => s.resolve(value, c);
  }

  parseBracketedExpression(result: ParseResult): ResultEvaluator {
    this.lexer.getNextToken(); // Consume the opening bracket.
    const root = this.parseExpression(result);
    this.expectAndConsume(result, TokenType.ParenthesisClose);
    return root;
  }

  parseDottedIdentifier(result: ParseResult): string[] {
    const parts: string[] = [];
    parts.push(this.expectAndConsume(result, TokenType.Identifier).value);
    while (this.lexer.peekNextToken().type === TokenType.Period) {
      this.lexer.getNextToken();
      parts.push(this.expectAndConsume(result, TokenType.Identifier).value);
    }
    return parts;
  }
}
