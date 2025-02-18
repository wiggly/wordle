import {DomainError} from "./error.js";
import {Result, resultErr, resultOk} from "./result.js";

export type DomainResult<T> = Result<T, DomainError>;

export function domainResult<T>(value: T): DomainResult<T> {
    return resultOk<T, DomainError>(value)
}

export function domainError<T>(value: DomainError): DomainResult<T> {
    return resultErr<T, DomainError>(value)
}

