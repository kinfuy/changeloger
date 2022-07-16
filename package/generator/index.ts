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

  if (tagList.length > 0) {
    for (let tag = 0; tag < tagList.length; tag++) {
      const from = tag + 1 < tagList.length ? tagList[tag + 1].tag : undefined;
      const to = tagList[tag].tag;
      const commits = await getGitCommits(from, to);
      if (commits) {
        const rows = parseCommits(commits, config);
        const markdown = generateBeautifyMd(
          rows,
          config,
          tagList[tag + 1],
          tagList[tag]
        );
        if (markdown) markdowns.push(markdown);
      }
    }
  } else {
    const commits = await getGitCommits();
    const rows = parseCommits(commits, config);
    const markdown = generateBeautifyMd(rows, config);
    if (markdown) markdowns.push(markdown);
  }

  await writeFile(
    resolve(process.cwd(), config.output),
    markdowns.join('\n').trim()
  );
};
