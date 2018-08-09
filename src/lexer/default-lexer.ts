import { CharacterStream } from './character-stream';
import { Lexer } from './lexer.interface';
import { StringCharacterStream } from './string-character-stream';
import { Token } from './token';
import { TokenType } from './token-type';

const SYMBOLS = [
  // Unary
  TokenType.Exclamation,
  TokenType.Plus,
  TokenType.Minus,

  // Boolean
  TokenType.ExclamationEquals,
  TokenType.Equals,
  TokenType.GreaterThan,
  TokenType.GreaterThanEquals,
  TokenType.LessThan,
  TokenType.LessThanEquals,
  TokenType.Ampersand,
  TokenType.Pipe,

  // Multipliers
  TokenType.Slash,
  TokenType.Asterisk,
  TokenType.Percent,

  // Other
  TokenType.Comma,
  TokenType.ParenthesisOpen,
  TokenType.ParenthesisClose,
  TokenType.Period,
];

export class DefaultLexer implements Lexer {
  protected stream: CharacterStream;
  private currentToken: Token;
  private nextToken: Token;

  private numCharRegex: RegExp = /[0-9]/;
  private idCharRegex: RegExp = /[a-zA-Z]/;

  constructor(input: CharacterStream | string) {
    if (this.isCharacterStream(input)) {
      this.stream = input;
    } else if (typeof input === 'string') {
      this.stream = new StringCharacterStream(input);
    } else {
      throw new Error('Unrecognized input type. input must be of type "CharacterStream | string".')
    }
  }

  private isCharacterStream(input: any): input is CharacterStream {
    return input.getCurrentCharacter;
  }

  public peekNextToken(): Token {
    if (!this.nextToken) {
      this.nextToken = this.constructNextToken();
    }
    return this.nextToken;
  }

  public getNextToken(): Token {
    if (this.nextToken) {
      this.currentToken = this.nextToken;
      this.nextToken = null;
    } else {
      this.currentToken = this.constructNextToken();
    }
    return this.currentToken;
  }

  protected parseIdentifier(): Token {
    let buffer = this.stream.getCurrentCharacter();
    while (this.idCharRegex.test(this.stream.peekNextCharacter())) {
      buffer += this.stream.getNextCharacter();
    }
    return this.createToken(TokenType.Identifier, buffer);
  }

  protected parseNumber(): Token {
    let buffer = this.stream.getCurrentCharacter();
    let hasDot = false;
    let nextChar = this.stream.peekNextCharacter();
    while (nextChar === '.' || this.numCharRegex.test(nextChar)) {
      if (nextChar === '.') {
        if (hasDot) { break; }
        hasDot = true;
      }
      buffer += this.stream.getNextCharacter();
      nextChar = this.stream.peekNextCharacter();
    }
    return this.createToken(TokenType.Number, buffer);
  }

  private constructNextToken() {
    let curChar: string;
    while (curChar = this.stream.getNextCharacter()) {
      switch (true) {
        case this.idCharRegex.test(curChar): return this.parseIdentifier();
        case this.numCharRegex.test(curChar): return this.parseNumber();
        case !!SYMBOLS.find(s => s.startsWith(curChar)): {
          let lastFullMatch: TokenType;
          let searchString = curChar;
          let hasPeeked = false;
          while (SYMBOLS.find(s => s.startsWith(searchString))) {
            if (hasPeeked) { this.stream.getNextCharacter(); }
            lastFullMatch = SYMBOLS.find(s => s === searchString) || lastFullMatch;
            searchString += this.stream.peekNextCharacter();
            hasPeeked = true;
          }
          return this.createToken(lastFullMatch, lastFullMatch);
        }
        case /\W/.test(curChar):
          // Ignore whitespace.
          break;
        default: throw new Error(`Unknown token: '${curChar}'.`);
      }
    }
    // Terminator at end of stream.
    return this.createToken(TokenType.Terminator);
  }

  private createToken(type: TokenType, value?: string): Token {
    let position = this.stream.getCurrentPosition();
    if (value) { position -= value.length - 1; }
    return new Token(type, position, value);
  }
}
