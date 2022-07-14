import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { loadChangelogConfig } from '../changeloger.config';
import {
  getDefaultGitRepo,
  getGitCommits,
  getGitRepo,
  getGitTagList,
  parseCommits,
} from '../utils/git';
import { generateBeautifyMd } from '../utils/markdown';

export const generatorLog = async () => {
  const config = await loadChangelogConfig();
  const tagList = await getGitTagList();
  const markdowns = [];
  const repo = await getDefaultGitRepo();
  if (tagList.length > 0) {
    for (let tag = 0; tag < tagList.length; tag++) {
      config.from = tag + 1 < tagList.length ? tagList[tag + 1].tag : undefined;
      config.to = tagList[tag].tag;
      const commits = await getGitCommits(config.from, config.to);
      markdowns.push('', `# ${tagList[tag].tag}(${tagList[tag].date})\n`);
      const rows = parseCommits(commits, config);
      const markdown = generateBeautifyMd(rows, config);
      if (markdown) markdowns.push(markdown);
    }
  } else {
    const commits = await getGitCommits();
    const rows = parseCommits(commits, config);
    const markdown = generateBeautifyMd(rows, config);
    if (markdown) markdowns.push(markdown);
  }

  await writeFile(
    resolve(process.cwd(), 'GLOBALCHANGE.md'),
    markdowns.join('\n').trim()
  );
};
