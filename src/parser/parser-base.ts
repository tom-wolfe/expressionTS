import { DefaultLexer, Lexer, Token, TokenType } from '../lexer';
import { ErrorMessage } from './error-message';
import { Expression } from './expression';
import { ObjectMap } from './object-map';
import { ParseResult } from './parse-result';
import { DefaultResolutionContext, ResolutionContext } from './resolution-context';

export abstract class ParserBase {

  private createLexer(input: Lexer | string): Lexer {
    if (this.isLexer(input)) {
      return input;
    } else if (typeof input === 'string') {
      return new DefaultLexer(input);
    } else {
      throw new Error('Unrecognized input type. input must be of type "ILexer | string".');
    }
  }

  private createContext(context: ResolutionContext | ObjectMap): ResolutionContext {
    if (this.isResolutionContext(context)) {
      return context;
    } else {
      return new DefaultResolutionContext(context);
    }
  }

  private isLexer(input: any): input is Lexer {
    return input.getNextToken;
  }

  private isResolutionContext(input: any): input is ResolutionContext {
    return input && input.resolve;
  }

  parse(input: Lexer | string): ParseResult {
    const lexer = this.createLexer(input);
    const errors: ErrorMessage[] = [];
    const exp: Expression = this.parseCore(lexer, errors);
    const wrapper: Expression = context => exp(this.createContext(context));
    return new ParseResult(wrapper, errors);
  }

  protected abstract parseCore(lexer: Lexer, errors: ErrorMessage[]): Expression;

  protected expectAndConsume(lexer: Lexer, errors: ErrorMessage[], expected: TokenType, actual?: Token): Token {
    this.expect(lexer, errors, expected, actual);
    return lexer.getNextToken();
  }

  protected expect(lexer: Lexer, errors: ErrorMessage[], expected: TokenType, actual?: Token): Token {
    actual = actual || lexer.peekNextToken();
    if (actual.type !== expected) {
      this.errorToken(errors, expected, actual);
    }
    return actual;
  }

  protected errorToken(errors: ErrorMessage[], expected: TokenType, actual: Token) {
    let message = `Error at position ${actual.position}.`;
    message += ` Expected token of type ${expected}, found token of type ${actual.type} of value '${actual.value}'.`;
    this.errorMessage(errors, message, actual);
  }

  protected errorMessage(errors: ErrorMessage[], message: string, token: Token) {
    errors.push(new ErrorMessage(message, token, new Error().stack));
  }
}
