import { Lexer, TokenType } from '../lexer';
import { ErrorMessage } from './error-message';
import { ParseResult } from './parse-result';
import { ParserBase } from './parser-base';
import { DefaultResolutionContext } from './resolution-context';
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

  parse(): ParseResult {
    const errors: ErrorMessage[] = [];
    const exp = this.parseExpression(errors);
    const wrapper = s => exp(s || new DefaultResolutionContext());
    return new ParseResult(wrapper, errors);
  }

  parseExpression(errors: ErrorMessage[]): ResultEvaluator {
    const lhs = this.parseSimpleExpression(errors);

    const operator = BooleanOperatorMap[this.lexer.peekNextToken().type];
    if (!operator) { return lhs; }
    this.lexer.getNextToken();

    const rhs = this.parseSimpleExpression(errors);
    return s => operator(lhs(s), rhs(s));
  }

  parseSimpleExpression(errors: ErrorMessage[]): ResultEvaluator {
    let tokenType = this.lexer.peekNextToken().type;

    const unaryOp = UnaryOperatorMap[tokenType];

    // Consume unary operator. '+3' for example.
    if (unaryOp) { this.lexer.getNextToken(); }

    // Parse as a term. Will be a number if we've just consumed the unary token.
    let root: ResultEvaluator = this.parseTerm(errors);

    // If we had a unary operator, then add it in.
    if (unaryOp) {
      const n = root;
      root = s => unaryOp(n(s));
    }

    tokenType = this.lexer.peekNextToken().type;
    while (Object.keys(AddOperatorMap).indexOf(tokenType) > -1) {
      const operation: BooleanOperator = AddOperatorMap[tokenType];

      // Consume the operator.
      this.lexer.getNextToken();

      const l = root;
      const r = this.parseTerm(errors);
      root = s => operation(l(s), r(s));
      tokenType = this.lexer.peekNextToken().type;
    }
    return root;
  }

  parseTerm(errors: ErrorMessage[]): ResultEvaluator {
    let root: ResultEvaluator = this.parseFactor(errors);

    let tokenType = this.lexer.peekNextToken().type;
    while (Object.keys(MultiOperatorMap).indexOf(tokenType) > -1) {
      const operation: BooleanOperator = MultiOperatorMap[tokenType];

      // Consume the operator.
      this.lexer.getNextToken();

      const l = root;
      const r = this.parseFactor(errors);
      root = s => operation(l(s), r(s));
      tokenType = this.lexer.peekNextToken().type;
    }

    return root;
  }

  parseFactor(errors: ErrorMessage[]): ResultEvaluator {
    const token = this.lexer.peekNextToken();
    switch (token.type) {
      case TokenType.Identifier:
        const identifier = this.parseDottedIdentifier(errors);
        if (this.lexer.peekNextToken().type === TokenType.ParenthesisOpen) {
          return this.parseFunction(errors, identifier);
        } else {
          return this.parseVariable(errors, identifier);
        }
      case TokenType.ParenthesisOpen: return this.parseBracketedExpression(errors);
      case TokenType.Number: return this.parseNumber(errors);
      default: this.errorToken(errors, TokenType.Number, token);
    }
  }

  parseFunction(errors: ErrorMessage[], name?: string[]): ResultEvaluator {
    const functionName = name || this.parseDottedIdentifier(errors);

    this.expectAndConsume(errors, TokenType.ParenthesisOpen)

    const args: ResultEvaluator[] = [];

    // Parse function arguments.
    const token = this.lexer.peekNextToken();
    if (token.type !== TokenType.ParenthesisClose) {
      args.push(this.parseExpression(errors));
      while (this.lexer.peekNextToken().type === TokenType.Comma) {
        this.lexer.getNextToken(); // Consume the comma.
        args.push(this.parseExpression(errors));
      }
    }

    this.expectAndConsume(errors, TokenType.ParenthesisClose);

    return s => {
      const resolvedArgs = args.map(a => a(s));
      return s.resolve(functionName)(...resolvedArgs);
    };
  }

  parseNumber(errors: ErrorMessage[]): ResultEvaluator {
    const numberToken = this.lexer.getNextToken();
    return () => Number(numberToken.value);
  }

  parseVariable(errors: ErrorMessage[], identifier?: string[]): ResultEvaluator {
    const value = identifier || this.parseDottedIdentifier(errors);
    return s => s.resolve(value);
  }

  parseBracketedExpression(errors: ErrorMessage[]): ResultEvaluator {
    this.lexer.getNextToken(); // Consume the opening bracket.
    const root = this.parseExpression(errors);
    this.expectAndConsume(errors, TokenType.ParenthesisClose);
    return root;
  }

  parseDottedIdentifier(errors: ErrorMessage[]): string[] {
    const parts: string[] = [];
    parts.push(this.expectAndConsume(errors, TokenType.Identifier).value);
    while (this.lexer.peekNextToken().type === TokenType.Period) {
      this.lexer.getNextToken();
      parts.push(this.expectAndConsume(errors, TokenType.Identifier).value);
    }
    return parts;
  }
}
