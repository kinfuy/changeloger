import type { ChangelogConfig } from '../changeloger.config';
import type { GitCommit, Reference, TagInfo } from './git';

export const generateBeautifyMd = (
  commits: GitCommit[],
  config: ChangelogConfig,
  from?: TagInfo,
  to?: TagInfo
) => {
  const { repository } = config;
  const typeGroups = groupBy(commits, 'type');
  const markdown: string[] = [];
  const breakingChanges = [];

  const compare = `${from?.tag ? `${from?.tag}...` : ''}${to?.tag}`;

  if (to && repository) {
    markdown.push(
      '',
      `# [${to.tag}](${repository}/compare/${compare})（${to.date}）\n`
    );
  } else if (to) {
    markdown.push('', `# ${to.tag}(${to.date})\n`);
  }

  for (const type in config.theme.types) {
    const group = typeGroups[type];
    if (!group || !group.length) {
      continue;
    }

    markdown.push('', `### ${config.theme.types[type].title}`, '');
    for (const commit of group.reverse()) {
      const line = formatCommit(commit, repository);
      markdown.push(line);
      if (commit.isBreaking) {
        breakingChanges.push(line);
      }
    }
  }
  if (breakingChanges.length) {
    markdown.push('', '#### ⚠️  Breaking Changes', '', ...breakingChanges);
  }
  let authors = commits.flatMap((commit) =>
    commit.authors.map((author) => formatName(author.name))
  );
  authors = uniq(authors).sort();

  if (authors.length) {
    markdown.push(
      '',
      '### ' + '❤️  Contributors',
      '',
      ...authors.map((name) => `- ${name}`)
    );
  }
  return markdown.join('\n').trim();
};

function groupBy(items: any[], key: string) {
  const groups: Record<string, any> = {};
  for (const item of items) {
    groups[item[key]] = groups[item[key]] || [];
    groups[item[key]].push(item);
  }
  return groups;
}
function formatName(name = '') {
  return name
    .split(' ')
    .map((p) => upperFirst(p.trim()))
    .join(' ');
}

function formatCommit(commit: GitCommit, repository: string | undefined) {
  return `  - ${commit.scope ? `**${commit.scope.trim()}:** ` : ''}${
    commit.isBreaking ? '⚠️  ' : ''
  }${upperFirst(commit.description)}${formatReference(
    commit.references,
    repository
  )}`;
}

function formatReference(
  references: Reference[],
  repository: string | undefined
) {
  const pr = references.filter((ref) => ref.type === 'pull');
  const issue = references.filter((ref) => ref.type === 'issue');
  if (pr.length || issue.length) {
    if (repository) {
      return ` (${[...pr, ...issue]
        .map((ref) => `[${ref.value}](${repository}/${ref.type}/${ref.value})`)
        .join(', ')})`;
    }
    return ` (${[...pr, ...issue].map((ref) => ref.value).join(', ')})`;
  }
  if (references.length) {
    if (repository) {
      return ` ([${references[0].value}](${repository}/commit/${references[0].value}))`;
    }
    return ` (${references[0].value})`;
  }
  return '';
}

function upperFirst(str: string) {
  return str.replace(/^[a-z]{1}/, (x) => x.toLocaleUpperCase());
}

function uniq(items: any[]) {
  return Array.from(new Set(items));
}
