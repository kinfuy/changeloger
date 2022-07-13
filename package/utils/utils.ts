import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from 'fs';
import { resolve } from 'path';

export const formatTargetDir = (targetDir?: string) => {
  if (targetDir) return targetDir.trim().replace(/\/+$/g, '');
  return undefined;
};

/**
 * copy文件
 * @param src
 * @param dest
 */
export const copy = (src: string, dest: string) => {
  const stat = statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    copyFileSync(src, dest);
  }
};

/**
 * copy目录
 * @param srcDir
 * @param destDir
 */
export const copyDir = (srcDir: string, destDir: string) => {
  mkdirSync(destDir, { recursive: true });
  for (const file of readdirSync(srcDir)) {
    const srcFile = resolve(srcDir, file);
    const destFile = resolve(destDir, file);
    copy(srcFile, destFile);
  }
};

/**
 * 是否有效的包名
 * @param projectName
 * @returns
 */
export const isValidPackageName = (projectName: string) => {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  );
};
/**
 * 清空目录
 * @param dir
 * @returns
 */
export const emptyDir = (dir: string) => {
  if (!existsSync(dir)) {
    return;
  }
  for (const file of readdirSync(dir)) {
    rmSync(resolve(dir, file), { recursive: true, force: true });
  }
};

/**
 * 是否空目录
 * @param path
 * @returns
 */
export const isEmpty = (path: string) => {
  const files = readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === '.git');
};
/**
 * 安全覆盖
 * @param dir
 * @returns
 */
export const canSafelyOverwrite = (dir: string) => {
  return !existsSync(dir) || readdirSync(dir).length === 0;
};

export const toValidPackageName = (projectName: string) => {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-');
};

/**
 * 排序package
 * @param packageJson
 * @returns
 */
export const sortDependencies = (packageJson: Record<string, any>) => {
  const sorted: Record<string, any> = {};

  const depTypes = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ];

  for (const depType of depTypes) {
    if (packageJson[depType]) {
      sorted[depType] = {};

      Object.keys(packageJson[depType])
        .sort()
        .forEach((name) => {
          sorted[depType][name] = packageJson[depType][name];
        });
    }
  }

  return {
    ...packageJson,
    ...sorted,
  };
};
