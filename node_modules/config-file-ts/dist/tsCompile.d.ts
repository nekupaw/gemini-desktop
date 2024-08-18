import * as ts from "typescript";
export interface CompileResult {
    localSources: string[];
    compiled: boolean;
}
export declare function tsCompile(fileNames: string[], options: ts.CompilerOptions): CompileResult;
