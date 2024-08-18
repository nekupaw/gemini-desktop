/** Load a typescript configuration file.
 * For speed, the typescript file is transpiled to javascript and cached.
 *
 * @param T type of default export value in the configuration file
 * @param outDir location to store the compiled javascript.
 * @returns the default exported value from the configuration file or undefined
 */
export declare function loadTsConfig<T>(tsFile: string, outDir?: string, strict?: boolean): T | undefined;
/** @return the directory that will be used to store transpilation output. */
export declare function defaultOutDir(tsFile: string, programName?: string): string;
