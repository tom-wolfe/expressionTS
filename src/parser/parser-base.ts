import { DefaultLexer, Lexer, Token, TokenType } from '../lexer';
import { ErrorMessage } from './error-message';
import { ParseResult } from './parse-result';

export abstract class ParserBase {
  protected readonly lexer: Lexer;

  constructor(input: Lexer | string) {
    if (this.isLexer(input)) {
      this.lexer = input;
    } else if (typeof input === 'string') {
      this.lexer = new DefaultLexer(input);
    } else {
      throw new Error('Unrecognized input type. input must be of type "ILexer | string".');
    }
  }

  private isLexer(input: any): input is Lexer {
    return input.getNextToken;
  }

  abstract parse(): ParseResult;

  protected expectAndConsume(errors: ErrorMessage[], expected: TokenType, actual?: Token): Token {
    this.expect(errors, expected, actual);
    return this.lexer.getNextToken();
  }

  protected expect(errors: ErrorMessage[], expected: TokenType, actual?: Token): Token {
    actual = actual || this.lexer.peekNextToken();
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
