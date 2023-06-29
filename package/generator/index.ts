import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { loadChangelogConfig } from '../changeloger.config';
import { getGitTagList } from '../utils/git';
import { buildDefaultTheme } from './defaultTheme';
import { buildSimpleTheme } from './simpleTheme';

export const generatorLog = async (configPath?: string) => {
  const config = await loadChangelogConfig(configPath);
  const tagList = await getGitTagList();
  if (config.tagSort === 'date') {
    tagList.sort((v1, v2) => {
      return new Date(v2.date).getTime() - new Date(v1.date).getTime();
    });
  }

  let markdowns: string[] = [];
  if (config.theme === 'default') {
    const defaultMd = await buildDefaultTheme(tagList, config);
    markdowns = [...defaultMd];
  }
  if (config.theme === 'simple') {
    const SimpleMd = await buildSimpleTheme(tagList, config);
    markdowns = [...SimpleMd];
  }

  await writeFile(
    resolve(process.cwd(), config.output),
    markdowns.join('\n').trim()
  );
};
