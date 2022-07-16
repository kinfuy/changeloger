import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { loadChangelogConfig } from '../changeloger.config';
import { getGitTagList } from '../utils/git';
import { buildDefaultTheme } from './defaultTheme';

export const generatorLog = async () => {
  const config = await loadChangelogConfig();
  const tagList = await getGitTagList();
  let markdowns: string[] = [];
  if (config.theme.name === 'default') {
    const defaultMd = await buildDefaultTheme(tagList, config);
    markdowns = [...defaultMd];
  }

  await writeFile(
    resolve(process.cwd(), config.output),
    markdowns.join('\n').trim()
  );
};
