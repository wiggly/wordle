/**
 * Ok result type
 *
 * @typeParam T the value type
 */
export type Ok<T> = { value: T };

/**
 * Error result type
 *
 * @typeParam T the error type
 */
export type Err<T> = { err: T };

/**
 * Result
 *
 * A discriminated union to hold either a successful result value or an error type.
 *
 * This could be done better with brands or something that is more foolproof at the type guard stage
 *
 * @typeParam T the type contained within the {@link Ok} union member
 * @typeParam E the type contained within the {@link Err} union member
 */
export type Result<T, E> = Err<E> | Ok<T>;

/**
 * Type-guard function to determine if a {@link Result} is {@link Ok}.
 */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return (result as Ok<T>).value !== undefined;
}

/**
 * Type-guard function to determine if a {@link Result} is {@link Err}.
 */
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return (result as Err<E>).err !== undefined;
}

/**
 * Helper function to create an {@link Ok} result
 */
export function resultOk<T, E>(value: T): Result<T, E> {
  return { value: value };
}

/**
 * Helper function to create an {@link Err} result
 */
export function resultErr<T, E>(value: E): Result<T, E> {
  return { err: value };
}

/**
 * Helper function to return the result value or raise an exception in {@link Error}
 *
 * @param result The domain result
 *
 * @typeParam T the type that successful results return
 */
export function unwrapResult<T, E>(result: Result<T, E>): T {
  if (isOk(result)) {
    return result.value;
  } else {
    throw new Error(`error - ${result.err}`);
  }
}
