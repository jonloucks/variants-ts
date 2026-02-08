import { messageCheck, used } from "@jonloucks/contracts-ts/auxiliary/Checks"
import { isNotPresent } from "@jonloucks/contracts-ts/api/Types";

/**
 * Runtime exception thrown for Variant related problems.
 */
export class VariantException extends Error {

  /**
   * Passthrough for {@link Error(String, Throwable)}
   *
   * @param message the message for this exception
   * @param thrown  the cause of this exception, null is allowed
   */
  public constructor(message: string, thrown: Error | null = null) {
    // super(messageCheck(message), thrown || undefined);
    super(messageCheck(message));
    used(thrown);
    this.name = "VariantException";
    Object.setPrototypeOf(this, VariantException.prototype)
  }

  /**
   * Ensure something that was caught is rethrown as a VariantException
   * @param caught the caught value
   * @param message the optional message to use if caught is not an VariantException
   */
  static rethrow(caught: unknown, message?: string): never {
    if (isNotPresent(caught)) {
       this.throwUnknown(message);
    } else if (guard(caught)) {
      throw caught;
    } else if (caught instanceof Error) {
      throw new VariantException(message ?? caught.message, caught);
    } else {
       this.throwUnknown(message);
    }
  }

  private static throwUnknown( message?: string): never {
    throw new VariantException(message ?? "Unknown type of caught value.");
  }
}

/**
 * Determine if an instance is a VariantException
 *
 * @param instance the instance to check
 * @returns true if the instance is a VariantException
 */
export function guard(instance: unknown): instance is VariantException {
  return instance instanceof VariantException;
}

