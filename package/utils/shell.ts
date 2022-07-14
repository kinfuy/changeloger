import execa from 'execa';
export const execCommand = async (cmd: string, args: string[]) => {
  const res = await execa(cmd, args);
  return res.stdout.trim();
};
