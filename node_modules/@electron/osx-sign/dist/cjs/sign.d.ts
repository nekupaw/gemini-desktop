import { SignOptions } from './types';
/**
 * This function returns a promise signing the application.
 */
export declare function signApp(_opts: SignOptions): Promise<void>;
/**
 * This function is a legacy callback implementation.
 *
 * @deprecated Please use the promise based "signApp" method
 */
export declare const sign: (opts: SignOptions, cb?: ((error?: Error) => void) | undefined) => void;
