export type Ok<T> = { value: T };

export type Err<T> = { err: T };

export type Result<T, E> = Err<E> | Ok<T>;

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return (result as Ok<T>).value !== undefined;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return (result as Err<E>).err !== undefined;
}

export function resultOk<T, E>(value: T): Result<T, E> {
  return { value: value };
}

export function resultErr<T, E>(value: E): Result<T, E> {
  return { err: value };
}

export function unwrapResult<T, E>(result: Result<T, E>): T {
  if (isOk(result)) {
    return result.value;
  } else {
    throw new Error(`error - ${result.err}`);
  }
}
