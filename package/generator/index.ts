import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { loadChangelogConfig } from '../changeloger.config';
import { getGitTagList } from '../utils/git';
import { buildDefaultTheme } from './defaultTheme';
import { buildSimpleTheme } from './simpleTheme';

export const generatorLog = async () => {
  debugger;
  const config = await loadChangelogConfig();
  const tagList = await getGitTagList();
  let markdowns: string[] = [];
  if (config.theme.name === 'default') {
    const defaultMd = await buildDefaultTheme(tagList, config);
    markdowns = [...defaultMd];
  }
  if (config.theme.name === 'simple') {
    const SimpleMd = await buildSimpleTheme(tagList, config);
    markdowns = [...SimpleMd];
  }

  await writeFile(
    resolve(process.cwd(), config.output),
    markdowns.join('\n').trim()
  );
};
