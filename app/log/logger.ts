import chalk from 'chalk';
import * as glob from '../../glob';

export function debug(message: string) {
  const isDebug = glob.getEnv('DEVELOPER_MODE', 'false') === 'true';
  if (isDebug) console.log(chalk.bold.cyan('✎') + ' ' + chalk.bold(message));
}
export function info(message: string) {
  console.log(chalk.bold.blue('🛈') + ' ' + chalk.bold(message));
}
export function warn(message: string) {
  console.log(chalk.bold.yellow('⚠') + ' ' + chalk.bold(message));
}
export function error(message: string) {
  console.log(chalk.red.red('✖') + ' ' + chalk.bold(message));
}
export function success(message: string) {
  console.log(chalk.green('✔') + ' ' + chalk.bold(message));
}
