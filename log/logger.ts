import ansiColors from 'ansi-colors';
import * as glob from '../glob';

export function debug(message: any) {
  const isDebug = glob.getEnv('DEVELOPER_MODE', 'false') === 'true';
  if (isDebug)
    console.log(ansiColors.bold.cyan('✎') + ' ' + ansiColors.bold(message));
}
export function info(message: any) {
  console.log(ansiColors.bold.blue('🛈') + ' ' + ansiColors.bold(message));
}
export function warn(message: any) {
  console.log(ansiColors.bold.yellow('⚠') + ' ' + ansiColors.bold(message));
}
export function error(message: any) {
  console.log(ansiColors.red.red('✖') + ' ' + ansiColors.bold(message));
}
export function success(message: any) {
  console.log(ansiColors.green('✔') + ' ' + ansiColors.bold(message));
}
