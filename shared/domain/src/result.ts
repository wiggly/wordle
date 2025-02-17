import { DomainError } from "./error.js";

export type Ok<T> = { value: T };

export type Err<T> = { err: T };

export type Result<T, E> = Err<E> | Ok<T>;

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return (result as Ok<T>).value !== undefined;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return (result as Err<E>).err !== undefined;
}

export function domainResult<T>(value: T): DomainResult<T> {
  return { value: value };
}

export function domainErrorResult<T>(value: DomainError): DomainResult<T> {
  return { err: value };
}

export function unwrapResult<T, E>(result: Result<T, E>): T {
  if (isOk(result)) {
    return result.value;
  } else {
    throw new Error(`error - ${result.err}`);
  }
}

export type DomainResult<T> = Result<T, DomainError>;
