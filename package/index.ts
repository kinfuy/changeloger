import minimist from 'minimist';
import pkg from './package.json';
import { generatorLog } from './generator';
const init = async () => {
  const argv = minimist(process.argv.slice(2), {
    string: ['_'],
    alias: {
      version: ['v', 'version'],
    },
  });
  if (argv.version) {
    console.log(`v${pkg.version}`);
    return;
  }
  await generatorLog();
};

init().catch((e) => {
  console.error(e);
});
