/**
 * Configuration
 *
 * A domain level configuration object.
 *
 * This should exclude any low-level details of how the configuration is loaded from the current environment
 * whether it is a process environment value, configuration file, command line arguments or some combination.
 *
 * Different infrastructure types can create their own functions that generate a value of the correct
 * shape, or simply construct one in memory for testing or simple applications.
 *
 * Terminology: Value Object (DDD)
 */
export interface Configuration {
    readonly maxAttempts: number
}
