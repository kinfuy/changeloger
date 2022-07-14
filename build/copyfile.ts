import { resolve } from 'path';
import { copy, copyFile } from '@alqmc/build-utils';
import { enterPath, outputPath, rootPath } from './utils/path';
export const copyFiles = async () => {
  Promise.all([
    copyFile(
      resolve(enterPath, 'package.json'),
      resolve(outputPath, 'package.json')
    ),
    copyFile(resolve(rootPath, 'README.md'), resolve(outputPath, 'README.md')),
    copy(resolve(enterPath, 'template'), resolve(outputPath, 'template')),
    copy(resolve(rootPath, 'assets'), resolve(outputPath, 'assets')),
  ]);
};
