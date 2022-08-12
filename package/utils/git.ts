// https://github.com/unjs/changelogen

import { execCommand } from './shell';
import type { ChangelogConfig } from '../changeloger.config';

export interface GitCommitAuthor {
  name: string;
  email: string;
}
export interface Reference {
  type: 'hash' | 'issue' | 'pull';
  value: string;
}
export interface TagInfo extends Record<string, string> {
  tag: string;
  date: string;
}
export interface RawGitCommit {
  message: string;
  body: string;
  shortHash: string;
  author: GitCommitAuthor;
}

export interface GitCommit extends RawGitCommit {
  description: string;
  type: string;
  scope: string;
  references: Reference[];
  authors: GitCommitAuthor[];
  isBreaking: boolean;
}

export const getGitCommits = async (from?: string | undefined, to?: string) => {
  if (!to) to = 'HEAD';
  const r = await execCommand('git', [
    '--no-pager',
    'log',
    `${from ? `${from}...` : ''}${to}`,
    '--pretty="----%n%s|%h|%an|%ae%n%b"',
  ]);
  return r
    .split('----\n')
    .splice(1)
    .map((line) => {
      const [firstLine, ..._body] = line.split('\n');
      const [message, shortHash, authorName, authorEmail] =
        firstLine.split('|');
      const r: RawGitCommit = {
        message,
        shortHash,
        author: { name: authorName, email: authorEmail },
        body: _body.join('\n'),
      };
      return r;
    });
};

// https://www.conventionalcommits.org/en/v1.0.0/
// https://regex101.com/r/FSfNvA/1
const ConventionalCommitRegex =
  /(?<type>[a-z]+)(\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i;
const CoAuthoredByRegex = /Co-authored-by:\s*(?<name>.+)(<(?<email>.+)>)/gim;
const PullRequestRE = /\([a-z ]*(#[0-9]+)\s*\)/gm;
const IssueRE = /(#[0-9]+)/gm;

export const parseGitCommit = (
  commit: RawGitCommit,
  config: ChangelogConfig
) => {
  const match = commit.message.match(ConventionalCommitRegex);
  let type = match?.groups!.type;
  if (config.showNotMatchComiit && !type) {
    type = 'other';
  }

  let scope = match?.groups?.scope || '';
  scope = config.scopeMap[scope] || scope;

  const isBreaking = Boolean(match?.groups?.breaking);

  let description =
    match?.groups?.description || type === 'chore' || config.showNotMatchComiit
      ? commit.message
      : '';

  const references: Reference[] = [];

  if (description) {
    Array.from(description.matchAll(PullRequestRE)).forEach((m) => {
      references.push({ type: 'pull', value: m[1] });
    });
    Array.from(description.matchAll(IssueRE)).forEach((m) => {
      if (!references.find((i) => i.value === m[1])) {
        references.push({ type: 'issue', value: m[1] });
      }
    });
  }

  references.push({ value: commit.shortHash, type: 'hash' });

  // Remove references and normalize
  description = description?.replace(PullRequestRE, '').trim();

  // Find all authors
  const authors: GitCommitAuthor[] = [commit.author];
  for (const match of commit.body.matchAll(CoAuthoredByRegex)) {
    authors.push({
      name: (match.groups?.name || '').trim(),
      email: (match.groups?.email || '').trim(),
    });
  }
  return {
    ...commit,
    authors,
    description,
    type,
    scope,
    references,
    isBreaking,
  };
};

export function parseCommits(
  commits: RawGitCommit[],
  config: any
): GitCommit[] {
  const rows = commits.map((commit) => parseGitCommit(commit, config));
  return rows.filter((x) => x) as GitCommit[];
}

export async function getLastGitTag() {
  const r = await execCommand('git', [
    '--no-pager',
    'tag',
    '-l',
    '--sort=taggerdate',
  ]).then((r) => r.split('\n'));
  return r[r.length - 1];
}

export const getCurrentGitBranch = async () => {
  const branch = await execCommand('git', [
    'rev-parse',
    '--abbrev-ref',
    'HEAD',
  ]);
  return branch;
};

export const getCurrentGitTag = async () => {
  const tag = await execCommand('git', ['tag', '--points-at', 'HEAD']);
  return tag;
};

export async function getCurrentGitRef() {
  const tag = await getCurrentGitTag();
  const branch = await getCurrentGitBranch();
  return tag || branch;
}

export const getGitTagList = async (): Promise<TagInfo[]> => {
  // git for-each-ref --format="%(refname:short) | %(creatordate:short)" "refs/tags/*"
  const taglist = await execCommand('git', [
    'for-each-ref',
    '--format="%(refname:short)|%(creatordate:short)',
    'refs/tags/*',
  ]).then((r) => r.split('\n'));
  return taglist
    .reverse()
    .filter((x) => x)
    .map((x) => {
      const item = x.replace(/['"]/g, '').split('|');
      return {
        tag: item[0],
        date: item[1],
      };
    });
};

export const getGitRepo = async (key: string) => {
  const repo = await execCommand('git', ['remote', 'get-url', '--push', key]);
  return repo;
};

export const getDefaultGitRepo = async () => {
  const repos = ['origin', 'github', 'gitee'];
  for (let i = 0; i < repos.length; i++) {
    try {
      const repo = await getGitRepo(repos[i]);
      if (/^http/.test(repo)) {
        return repo.slice(0, repo.lastIndexOf('.'));
      }
    } catch (error) {}
  }
  return undefined;
};
