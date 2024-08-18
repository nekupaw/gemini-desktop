export declare type MakeUniversalOpts = {
    /**
     * Absolute file system path to the x64 version of your application.  E.g. /Foo/bar/MyApp_x64.app
     */
    x64AppPath: string;
    /**
     * Absolute file system path to the arm64 version of your application.  E.g. /Foo/bar/MyApp_arm64.app
     */
    arm64AppPath: string;
    /**
     * Absolute file system path you want the universal app to be written to.  E.g. /Foo/var/MyApp_universal.app
     *
     * If this file exists it will be overwritten ONLY if "force" is set to true
     */
    outAppPath: string;
    /**
     * Forcefully overwrite any existing files that are in the way of generating the universal application
     */
    force: boolean;
    /**
     * Merge x64 and arm64 ASARs into one.
     */
    mergeASARs?: boolean;
    /**
     * Minimatch pattern of paths that are allowed to be present in one of the ASAR files, but not in the other.
     */
    singleArchFiles?: string;
    /**
     * Minimatch pattern of binaries that are expected to be the same x64 binary in both of the ASAR files.
     */
    x64ArchFiles?: string;
    /**
     * Minimatch pattern of paths that should not receive an injected ElectronAsarIntegrity value
     */
    infoPlistsToIgnore?: string;
};
export declare const makeUniversalApp: (opts: MakeUniversalOpts) => Promise<void>;
