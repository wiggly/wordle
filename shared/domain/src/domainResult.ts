import {DomainError, DomainException} from "./error.js";
import {isErr, Result, resultErr, resultOk} from "./result.js";

/**
 * A Result type limited to errors with type {@link DomainError}
 */
export type DomainResult<T> = Result<T, DomainError>;

/**
 * Helper function to create a successful domain result
 */
export function domainResult<T>(value: T): DomainResult<T> {
    return resultOk<T, DomainError>(value)
}

/**
 * Helper function to create an error domain result
 */
export function domainError<T>(value: DomainError): DomainResult<T> {
    return resultErr<T, DomainError>(value)
}

/**
 * Helper function to return the domain result value or raise an exception
 *
 * @param result The domain result
 *
 * @typeParam T the type that successful results return
 */
export function unwrapDomainResult<T>(result: DomainResult<T>): T {
    if(isErr(result)) {
        throw new DomainException(result.err)
    } else {
        return result.value
    }
}

