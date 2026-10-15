// Load a @braintied/* package from the project being designed (its
// node_modules), so the scripts work from any folder. If it isn't installed,
// say the one command that installs it.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

export async function load(pkg) {
  const require = createRequire(pathToFileURL(`${process.cwd()}/package.json`));
  try {
    return await import(pathToFileURL(require.resolve(pkg)).href);
  } catch (error) {
    if (error?.code !== "MODULE_NOT_FOUND" && error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
    console.error(
      `${pkg} isn't installed in this project. Run:\n  pnpm add -D ${pkg}\nthen run this again.\n` +
        `If that install fails (404 or 401), don't retry: skip this script and follow the rules in this stage's reference file.`,
    );
    process.exit(2);
  }
}
