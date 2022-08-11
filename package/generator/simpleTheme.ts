import { getGitCommits, parseCommits } from '../utils/git';
import { generateSimpleMd } from '../utils/markdown';
import type { TagInfo } from '../utils/git';
import type { ChangelogConfig } from '../changeloger.config';

export const buildSimpleTheme = async (
  tagList: TagInfo[],
  config: ChangelogConfig
): Promise<string[]> => {
  const markdowns: string[] = [];
  if (tagList.length > 0) {
    for (let tag = -1; tag < tagList.length; tag++) {
      const from = (tagList[tag + 1] && tagList[tag + 1].tag) ?? undefined;
      const to = (tagList[tag] && tagList[tag].tag) ?? undefined;
      const commits = await getGitCommits(from, to);
      if (commits) {
        const rows = parseCommits(commits, config);
        const markdown = generateSimpleMd(
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
    const markdown = generateSimpleMd(rows, config);
    if (markdown) markdowns.push(markdown);
  }
  return markdowns;
};
