// Load a @braintied/* package from the project being designed (its
// node_modules), so the scripts work from any folder. If it isn't installed,
// say the one command that installs it.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

export async function load(pkg) {
  const require = createRequire(pathToFileURL(`${process.cwd()}/package.json`));
  try {
    return await import(pathToFileURL(require.resolve(pkg)).href);
  } catch {
    console.error(`${pkg} isn't installed in this project. Run:\n  pnpm add -D ${pkg}\nthen run this again.`);
    process.exit(2);
  }
}
