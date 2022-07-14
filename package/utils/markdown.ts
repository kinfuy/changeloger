import type { ChangelogConfig } from '../changeloger.config';
import type { GitCommit, Reference } from './git';

export const generateBeautifyMd = (
  commits: GitCommit[],
  config: ChangelogConfig
) => {
  const typeGroups = groupBy(commits, 'type');
  const markdown: string[] = [];
  const breakingChanges = [];
  for (const type in config.types) {
    const group = typeGroups[type];
    if (!group || !group.length) {
      continue;
    }

    markdown.push('', `### ${config.types[type].title}`, '');
    for (const commit of group.reverse()) {
      const line = formatCommit(commit);
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

function formatCommit(commit: GitCommit) {
  return `  - ${commit.scope ? `**${commit.scope.trim()}:** ` : ''}${
    commit.isBreaking ? '⚠️  ' : ''
  }${upperFirst(commit.description)}${formatReference(commit.references)}`;
}

function formatReference(references: Reference[]) {
  const pr = references.filter((ref) => ref.type === 'pull-request');
  const issue = references.filter((ref) => ref.type === 'issue');
  if (pr.length || issue.length) {
    return ` (${[...pr, ...issue].map((ref) => ref.value).join(', ')})`;
  }
  if (references.length) {
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
