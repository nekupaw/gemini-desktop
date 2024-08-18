/** Return true if any files need compiling */
export declare function needsCompile(srcGlobs: string[], outDir: string): boolean;
/** Return true if all files exist on the filesystem */
export declare function expectFilesExist(files: string[]): boolean;
/** @return path to the js file that will be produced by typescript compilation */
export declare function jsOutFile(tsFile: string, outDir: string): string;
export declare function compileIfNecessary(sources: string[], outDir: string, strict?: boolean): boolean;
/** create a symlink, replacing any existing linkfile */
export declare function symLinkForce(existing: string, link: string): void;
/** @return the resolved path to the nearest node_modules file,
 * either in the provided directory or a parent.
 */
export declare function nearestNodeModules(dir: string): string | undefined;
/**
 * Compile a typescript config file to js if necessary (if the js
 * file doesn't exist or is older than the typescript file).
 *
 * @param tsFile path to ts config file
 * @param outDir directory to place the compiled js file
 * @returns the path to the compiled javascript config file,
 *   or undefined if the compilation fails.
 */
export declare function compileConfigIfNecessary(tsFile: string, outDir: string, strict?: boolean): string | undefined;
