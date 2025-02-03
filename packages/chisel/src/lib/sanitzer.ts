type SanitizeOptions = {
  maxLength?: number;
  allowSpecialChars?: boolean;
  allowNumbers?: boolean;
  allowWhitespace?: boolean;
  strictMode?: boolean;
};

class SQLiteSanitizer {
  private static readonly SQL_KEYWORDS = [
    "SELECT",
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "CREATE",
    "ALTER",
    "TABLE",
    "DATABASE",
    "TRUNCATE",
    "UNION",
    "JOIN",
    "WHERE",
    "FROM",
    "INTO",
    "EXEC",
    "EXECUTE",
    "PRAGMA",
  ];

  private static readonly SPECIAL_CHARS = /[;'"\\%_]/g;

  private static readonly DEFAULT_OPTIONS: SanitizeOptions = {
    maxLength: 255,
    allowSpecialChars: false,
    allowNumbers: true,
    allowWhitespace: true,
    strictMode: true,
  };

  /**
   * Main sanitization function
   */
  public static sanitize(input: string, options: SanitizeOptions = {}): string {
    const settings = { ...this.DEFAULT_OPTIONS, ...options };

    if (input === null || input === undefined) {
      throw new Error("Input cannot be null or undefined");
    }

    try {
      let sanitized = this.basicSanitize(input.toString(), settings);

      if (settings.strictMode) {
        this.strictModeChecks(sanitized);
      }

      if (settings.maxLength && sanitized.length > settings.maxLength) {
        sanitized = sanitized.substring(0, settings.maxLength);
      }

      sanitized = this.patternBasedSanitize(sanitized, settings);

      return sanitized;
    } catch (error) {
      throw new Error(`Sanitization failed: ${error.message}`);
    }
  }

  /**
   * Basic sanitization steps
   */
  private static basicSanitize(
    input: string,
    options: SanitizeOptions,
  ): string {
    let result = input.trim();

    if (!options.allowSpecialChars) {
      result = result.replace(this.SPECIAL_CHARS, "");
    }

    if (!options.allowNumbers) {
      result = result.replace(/\d/g, "");
    }

    if (!options.allowWhitespace) {
      result = result.replace(/\s/g, "");
    }

    return result;
  }

  /**
   * Strict mode validation
   */
  private static strictModeChecks(input: string): void {
    const upperInput = input.toUpperCase();

    const sqlInjectionPatterns = [
      /(\%27)|(\')/i, // Single quotes
      /(\%22)|(\")/i, // Double quotes
      /(\%23)|(#)/i, // Hash tags
      /(\%26)|(--)/i, // Comments
      /(\%3B)|(;)/i, // Semicolons
      /(\%2F)|(\\\*)/i, // Forward slashes and asterisks
      /union\s+select/i, // UNION SELECT
      /exec\s*\(/i, // EXEC calls
    ];

    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(input)) {
        throw new Error("Potential SQL injection pattern detected");
      }
    }
  }

  /**
   * Pattern-based sanitization
   */
  private static patternBasedSanitize(
    input: string,
    options: SanitizeOptions,
  ): string {
    let result = input;

    result = result.replace(/%/g, "\\%");
    result = result.replace(/_/g, "\\_");

    result = result.replace(/'/g, "''");

    return result;
  }
}

/**
 * Helper function for quick sanitization with default options
 */
export function sanitizeSQLiteString(
  input: string,
  options?: SanitizeOptions,
): string {
  return SQLiteSanitizer.sanitize(input, options);
}
