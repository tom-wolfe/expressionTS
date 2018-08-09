export enum TokenType {
  // Unary
  Exclamation = '!',
  Plus = '+',
  Minus = '-',

  // Boolean
  ExclamationEquals = '!=',
  Equals = '=',
  GreaterThan = '>',
  GreaterThanEquals = '>=',
  LessThan = '<',
  LessThanEquals = '<=',
  Ampersand = '&',
  Pipe = '|',

  // Multipliers
  Slash = '/',
  Asterisk = '*',
  Percent = '%',

  // Other
  Identifier = 'identifier',
  Comma = ',',
  Period = '.',
  Number = 'number',
  ParenthesisClose = ')',
  ParenthesisOpen = '(',
  Terminator = 'terminator',
}
