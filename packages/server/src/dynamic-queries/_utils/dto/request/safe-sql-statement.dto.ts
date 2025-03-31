import { IsString, MaxLength } from 'class-validator';
import { NotMatches } from 'class-validator-extended';

const SQL_PATTERNS = {
  FUNCTIONS:
    /\b(AVG|COUNT|FIRST|LAST|MAX|MIN|SUM|SUBSTRING|CHAR|NCHAR|VARCHAR|NVARCHAR)\b/i,

  SYSTEM: /\b(sysobjects|syscolumns|systypes)\b/i,

  COMMENTS: /(--|#|\/\*|\*\/)/,

  SPECIAL_CHARS: /[;'"\\]/,

  BATCH_SEPARATORS: /;|\bGO\b/i,
};

export class SafeSqlStatement {
  @IsString()
  @MaxLength(255)
  @NotMatches(SQL_PATTERNS.FUNCTIONS, {
    message: 'SQL functions are not allowed in this field',
  })
  @NotMatches(SQL_PATTERNS.COMMENTS, {
    message: 'SQL comments are not allowed in this field',
  })
  statement: string;
}

const UNSAFE_SQL_PATTERN =
  /('|"|;|--|\\|\/|@@|@|char|nchar|varchar|nvarchar|alter|begin|cast|kill|open|select|sys|update)/i;
