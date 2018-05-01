/**
 * Type Definition taken from https://github.com/serkanyersen/pjson
 */

interface Person {
  name: string;
  url: string;
  email: string;
}

export type PackageJSONType = {
  /**
   * The name of the package.
   */
  name: string;

  /**
   * Version must be parseable by node-semver, which is
   * bundled with npm as a dependency.
   */
  version: string;

  /**
   * This helps people discover your package, as it's
   * listed in 'npm search'.
   */
  description: string;

  /**
   * This helps people discover your package as it's
   * listed in 'npm search'.
   */
  keywords: string[];

  /**
   * The url to the project homepage.
   */
  homepage: string;

  /**
   * The url to your project's issue tracker and / or the email
   * address to which issues should be reported. These are
   * helpful for people who encounter issues with your package.
   */
  bugs: {

    /**
     * The url to your project's issue tracker.
     */
    url: string;

    /**
     * The email address to which issues should be reported.
     */
    email: string;
  };

  /**
   * You should specify a license for your package so that
   * people know how they are permitted to use it, and any
   * restrictions you're placing on it.
   */
  license: string;

  /**
   * A person who has been involved in creating or maintaining this package
   */
  author: Person;

  /**
   * A list of people who contributed to this package.
   */
  contributors: Person[];

  /**
   * A list of people who maintains this package.
   */
  maintainers: Person[];

  /**
   * The 'files' field is an array of files to include in your project.
   * If you name a folder in the array, then it will also include
   * the files inside that folder.
   */
  files: string[];

  /**
   * The main field is a module ID that is the primary entry point to your program.
   */
  main: string;

  /**
   * Names of binaries for this package
   */
  bin: {};

  /**
   * Specify either a single file or an array of filenames to put in place for the man program to find.
   */
  man: string[];

  /**
   * Recognized directories for the package
   */
  directories: {
    /**
     * If you specify a 'bin' directory, then all the files in that folder will be used as the 'bin' hash.
     */
    bin: string;

    /**
     * Put markdown files in here. Eventually, these will be displayed nicely, maybe, someday.
     */
    doc: string;

    /**
     * Put example scripts in here. Someday, it might be exposed in some clever way.
     */
    example: string;

    /**
     * Tell people where the bulk of your library is. Nothing special
     * is done with the lib folder in any way, but it's useful meta info.
     */
    lib: string;

    /**
     * A folder that is full of man pages. Sugar to generate a 'man' array by walking the folder.
     */
    man: string;

    /**
     * Test folder
     */
    test: string
  };

  /**
   * Specify the place where your code lives. This is helpful for people who want to contribute.
   */
  repository: {
    type: string;
    url: string;
  };

  /**
   * The 'scripts' member is an object hash of script commands that are run at various times in
   * the lifecycle of your package. The key is the lifecycle event, and the value is
   * the command to run at that point.
   */
  scripts: {}

  /**
   * A 'config' hash can be used to set configuration parameters used in
   * package scripts that persist across upgrades.
   */
  config: {};

  /**
   * Dependencies are specified with a simple hash of package name to version range.
   * The version range is a string which has one or more space-separated descriptors.
   * Dependencies can also be identified with a tarball or git URL.
   */
  dependencies: {};
  devDependencies: {};
  optionalDependencies: {};
  peerDependencies: {};

  /**
   * Array of package names that will be bundled when publishing the package.
   */
  bundleDependencies: string[];

  engines: {};
  engineStrict: boolean;
  os: string[];
  cpu: string[];

  /**
   * If your package is primarily a command-line application
   * that should be installed globally, then set this value to
   * true to provide a warning if it is installed locally.
   */
  preferGlobal: boolean;

  /**
   * If set to true, then npm will refuse to publish it.
   */
  private: boolean;

  publishConfig: {};

  dist: {
    shasum: string;
    tarball: string;
  };

  readme: string;
}
