import { InvalidCursorException } from 'shared/domain/exceptions/invalid-cursor.exception';

export class CursorUtils {
  public static encodeCursor<T extends object>(payload: T): string {
    return Buffer.from(JSON.stringify(payload)).toString('base64url');
  }

  public static decodeCursor<T extends object>(cursor: string): T {
    try {
      const json = Buffer.from(cursor, 'base64url').toString('utf8');
      return JSON.parse(json) as T;
    } catch {
      throw new InvalidCursorException();
    }
  }

  public static parseFilterCommaValues(value?: string | string[]): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
}
