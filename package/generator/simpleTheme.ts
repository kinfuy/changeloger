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
    const commits = await getGitCommits();
    const rows = parseCommits(commits, config);
    const markdown = generateSimpleMd(rows, config);
    // if (markdown) markdowns.push(markdown);
  }
  return markdowns;
};
