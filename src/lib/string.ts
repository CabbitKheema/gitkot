/**
 * Converts a given string to title case by capitalizing the first letter of each word.
 *
 * This function uses a regular expression to identify word boundaries and 
 * replaces the first letter of each word with its uppercase equivalent.
 *
 * ## Regular Expression Breakdown:
 * - `\b` - Matches a word boundary (the position between a word character and a non-word character).
 * - `\w` - Matches any alphanumeric character (letters A-Z, a-z, digits 0-9, and underscores).
 * - `g` - Global flag ensures all occurrences in the string are processed.
 *
 * ## Example Usage:
 * ```typescript
 * stringToTitle("hello world"); // Returns "Hello World"
 * stringToTitle("this is a test"); // Returns "This Is A Test"
 * stringToTitle("123 testing abc"); // Returns "123 Testing Abc"
 * stringToTitle(""); // Returns ""
 * ```
 *
 * @param string - The input string to be converted.
 * @returns A new string where the first letter of each word is capitalized.
 */
export function stringToTitle(string: string): string {
    return string.replace(/\b\w/g, char => char.toUpperCase());
}
