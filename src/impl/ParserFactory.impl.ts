import { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { Transform } from "@jonloucks/contracts-ts/auxiliary/Transform";
import { ParserFactory } from "@jonloucks/variants-ts/api/ParserFactory";
import { isNotPresent, isPresent, ValueType } from "@jonloucks/variants-ts/api/Types";
import { parserCheck, presentCheck, valueCheck } from "@jonloucks/variants-ts/auxiliary/Checks";

/**
 * Factory function to create a ParserFactory instance.
 * 
 * @returns an instance of ParserFactory.
 */
export function create(): RequiredType<ParserFactory> {
  return ParserFactoryImpl.createInternal();
}

// ---- Implementation details below ----

class ParserFactoryImpl implements ParserFactory {

  stringParser(): Transform<ValueType, string> {
    return STRING_PARSER;
  }

  ofRawString(): Transform<OptionalType<ValueType>, OptionalType<string>> {
    return OF_RAW_STRING;
  }

  ofString(): Transform<OptionalType<ValueType>, OptionalType<string>> {
    return this.ofTrimAndSkipEmpty(this.stringParser())
  }

  booleanParser(): Transform<RequiredType<ValueType>, RequiredType<boolean>> {
    return BOOLEAN_PARSER;
  }

  ofBoolean(): Transform<OptionalType<ValueType>, OptionalType<boolean>> {
    return this.ofTrimAndSkipEmpty(BOOLEAN_PARSER)
  }

  numberParser(): Transform<RequiredType<ValueType>, RequiredType<number>> {
    return NUMBER_PARSER;
  }

  ofNumber(): Transform<OptionalType<ValueType>, OptionalType<number>> {
    return this.ofTrimAndSkipEmpty(NUMBER_PARSER)
  }

  bigIntParser(): Transform<RequiredType<ValueType>, RequiredType<bigint>> {
    return BIGINT_PARSER;
  }

  ofBigInt(): Transform<OptionalType<ValueType>, OptionalType<bigint>> {
    return this.ofTrimAndSkipEmpty(BIGINT_PARSER)
  }

  trim(value: RequiredType<ValueType>): RequiredType<string> {
    return STRING_PARSER.transform(value).trim();
  }

  string<T>(parser: Transform<string, T>): Transform<ValueType, T> {
    const validParser: Transform<string, T> = parserCheck(parser);
    return {
      transform: function (value: ValueType): T {
        return validParser.transform(STRING_PARSER.transform(value));
      }
    }
  }

  ofTrimAndSkipEmpty<T>(parser: Transform<RequiredType<ValueType>, T>): Transform<ValueType, OptionalType<T>> {
    const validParser: Transform<ValueType, T> = parserCheck(parser);
    return {
      transform: function (value: OptionalType<ValueType>): OptionalType<T> {
        if (isNotPresent(value) || isRawEmpty(value)) {
          return undefined;
        }
        return validParser.transform(STRING_PARSER.transform(value).trim());
      }
    }
  };

  ofList<T>(of: Transform<ValueType, OptionalType<T>>, delimiter: string): Transform<ValueType, OptionalType<Array<T>>> {
    const validDelimiter: string = presentCheck(delimiter, "Delimiter must be present.");
    return this.ofTrimAndSkipEmpty({
      transform: function (value: ValueType): Array<T> {
        const valueString = STRING_PARSER.transform(value);
        const parts: string[] = valueString.split(validDelimiter);
        const result: Array<T> = [];
        for (const part of parts) {
          const parsedPart = of.transform(part);
          if (isPresent(parsedPart)) {
            result.push(parsedPart);
          }
        }
        return result;
      }
    });
  }

  static createInternal(): ParserFactory {
    return new ParserFactoryImpl();
  }

  private constructor() {

  }
}

function isRawEmpty(value: RequiredType<ValueType>): boolean {
  if (typeof value === 'string') {
    return value.length === 0;
  } else if (Buffer.isBuffer(value)) {
    return value.length === 0;
  } else {
    return false; // assume not-empty, not doing conversion to check for emptiness
  }
}

const BOOLEAN_PARSER: Transform<ValueType, boolean> = {
  transform(value: ValueType): boolean {
    const validRaw = valueCheck(value);
    if (typeof validRaw === 'boolean') {
      return validRaw;
    } else if (typeof validRaw == 'number') {
      return validRaw === 1; // not going for truthy values, just 1 is true and everything else is false
    } else if (typeof validRaw == 'bigint') {
      return validRaw === BigInt(1); // not going for truthy values, just 1 is true and everything else is false
    } else if (typeof validRaw === 'string') {
      const lower = validRaw.toLowerCase();
      return lower === 'true' || lower === '1'; // not going for truthy values, just 'true' and '1' are true and everything else is false
    } else if (Buffer.isBuffer(validRaw)) {
      const lower = validRaw.toString('utf8').toLowerCase();
      return lower === 'true' || lower === '1'; // not going for truthy values, just 'true' and '1' are true and everything else is false
    } else {
      return validRaw.toString().toLowerCase() === 'true';
    }
  }
}

const NUMBER_PARSER: Transform<ValueType, number> = {
  transform(value: ValueType): number {
    const validRaw = valueCheck(value);
    if (typeof validRaw === 'number') {
      return validRaw;
    } else if (typeof validRaw === 'bigint') {
      return Number(validRaw);
    } else if (typeof validRaw === 'string') {
      return Number(validRaw);
    } else if (Buffer.isBuffer(validRaw)) {
      return Number(validRaw.toString('utf8'));
    } else {
      return Number(validRaw.toString());
    }
  }
}

const BIGINT_PARSER: Transform<ValueType, bigint> = {
  transform(value: ValueType): bigint {
    const validRaw: RequiredType<ValueType> = valueCheck(value);
    if (typeof validRaw === 'bigint') {
      return validRaw;
    } else if (typeof validRaw === 'number') {
      return BigInt(validRaw);
    } else if (typeof validRaw === 'string') {
      return BigInt(validRaw);
    } else if (Buffer.isBuffer(validRaw)) {
      return BigInt(validRaw.toString('utf8'));
    } else {
      return BigInt(validRaw.toString());
    }
  }
}

const STRING_PARSER: Transform<ValueType, string> = {
  transform(value: ValueType): string {
    const validRaw = valueCheck(value);
    if (typeof validRaw === 'string') {
      return validRaw;
    } else if (Buffer.isBuffer(validRaw)) {
      return validRaw.toString('utf8');
    } else {
      return validRaw.toString();
    }
  }
}

const OF_RAW_STRING: Transform<OptionalType<ValueType>, OptionalType<string>> = {
  transform: function (input: OptionalType<ValueType>): OptionalType<string> {
    if (isPresent(input)) {
      return STRING_PARSER.transform(input);
    }
    return undefined;
  }
};