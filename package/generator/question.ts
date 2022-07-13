import { red, reset } from 'kolorist';
import prompts from 'prompts';

export const getUserConfig = async () => {
  const questions: Array<prompts.PromptObject<string>> = [];
  try {
    return await prompts(questions, {
      onCancel: () => {
        throw new Error(`${red('✖')} Operation cancelled`);
      },
    });
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};
