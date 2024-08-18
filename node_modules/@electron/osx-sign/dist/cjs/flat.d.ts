import { FlatOptions } from './types';
/**
 * This function is exported and returns a promise flattening the application.
 */
export declare function buildPkg(_opts: FlatOptions): Promise<void>;
/**
 * This function is exported with normal callback implementation.
 *
 * @deprecated Please use the promise based "buildPkg" method
 */
export declare const flat: (opts: FlatOptions, cb?: ((error?: Error) => void) | undefined) => void;
