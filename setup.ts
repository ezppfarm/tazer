import {prompt} from 'enquirer';
import * as colors from 'ansi-colors';
import {createSpinner} from 'nanospinner';
import Database from './usecases/database';
import {ZodError, z} from 'zod';
import {domainValidator} from './utils/validatorUtils';
import {check} from 'tcp-port-used';

export const run = async (): Promise<undefined | Record<string, string>> => {
  const settings: Map<string, string> = new Map<string, string>();

  const addOptions = (prompt: Record<string, string>) => {
    Object.entries(prompt).forEach(entry => {
      if (entry[0] !== 'LISTEN_TYPE') {
        settings.set(entry[0], entry[1]);
      }
    });
  };

  const licensePrompt: Record<string, string> = await prompt({
    prefix: colors.bold.red('⚠'),
    type: 'select',
    name: 'confirm',
    align: 'left',
    message: colors.italic
      .gray(`  We sincerely appreciate your support and trust in tazer. Before you can proceed to use this
    software, we kindly ask you to accept the terms and conditions of the Mozilla Public License,
    Version 2.0 (MPL-2.0). The MPL-2.0 License is designed to protect both your rights and the rights
    of the software's creators. It outlines the permissions and responsibilities that come with using
    tazer. Please take a moment to carefully review the MPL-2.0 License. If you are in agreement with
    its terms and conditions, choose "I accept" and press Enter to signify your acceptance. If, for any
    reason, you do not wish to accept the terms of the MPL-2.0 License, please choose "I do not accept"
    to exit the installation process. Your decision will determine whether you can proceed with the
    installation and use of tazer.\n
  ${colors.cyan.bold('Thank you for your understanding and support!')}`),
    choices: [
      {
        message: colors.bold.redBright('I do not accept'),
        name: 'I do not accept',
      },
      {
        message: colors.bold.green('I accept'),
        name: 'I accept',
      },
    ],
  });
  if (licensePrompt.confirm === 'I do not accept') return undefined;

  const firstPrompts: Record<string, string> = await prompt([
    {
      type: 'text',
      message:
        'Please specify the root domain for your application (e.g., example.com)',
      name: 'DOMAIN',
      required: true,
      validate: value => {
        try {
          domainValidator.parse(value);
          return true;
        } catch (err) {
          const zodError = err as ZodError;
          return zodError.issues[0].message;
        }
      },
    },
    {
      type: 'text',
      message:
        'Please specify the domain for avatar hosting (e.g., avatar.example.com)',
      name: 'AVATAR_DOMAIN',
      required: true,
      validate: value => {
        try {
          domainValidator.parse(value);
          return true;
        } catch (err) {
          const zodError = err as ZodError;
          return zodError.issues[0].message;
        }
      },
    },
    {
      type: 'select',
      message:
        'How would you like the application to listen for incoming requests?',
      name: 'LISTEN_TYPE',
      required: true,
      choices: [
        {
          name: 'UNIX',
          value: 'UNIX',
          message: 'UNIX',
        },
        {
          name: 'TCP/IP',
          value: 'TCP/IP',
          message: 'TCP/IP',
        },
      ],
    },
  ]);

  addOptions(firstPrompts);

  const listenType = firstPrompts.LISTEN_TYPE;

  if (listenType === 'UNIX') {
    const unixQuestions: Record<string, string> = await prompt([
      {
        type: 'text',
        required: true,
        message:
          'Please provide the UNIX socket listen path (e.g., /tmp/tazer.sock)',
        name: 'UNIX_LISTEN',
        validate: value => {
          return value.endsWith('.sock')
            ? true
            : 'please specify a valid listen path.';
        },
      },
    ]);
    addOptions(unixQuestions);
  } else {
    let httpHost = '';
    const tcpQuestions: Record<string, string> = await prompt([
      {
        type: 'text',
        required: true,
        message:
          'Please specify the HTTP host (e.g., localhost, ip or your domain)',
        name: 'HTTP_HOST',
        result: value => {
          httpHost = value;
          return value;
        },
      },
      {
        type: 'text',
        required: true,
        message: 'Please specify the HTTP port (e.g., 8080)',
        name: 'HTTP_PORT',
        validate: async value => {
          try {
            const input = parseInt(value);
            if (isNaN(input)) return 'input must be numeric';
            const port = z.number().min(0).max(65535).parse(input);
            const portInUse = await check(port, httpHost);
            if (portInUse)
              return 'the selected port is already in use by another application.';
            return true;
          } catch (err) {
            if (err instanceof ZodError) {
              const zodError = err as ZodError;
              return zodError.issues[0].message;
            } else {
              return 'input must be numeric';
            }
          }
        },
      },
    ]);
    addOptions(tcpQuestions);
  }

  let mysqlConnected = false;

  while (!mysqlConnected) {
    const mysqlPrompts: Record<string, string> = await prompt([
      {
        type: 'text',
        required: true,
        message:
          'Please specify the MySQL host (e.g., localhost or a custom host)',
        name: 'MYSQL_HOST',
      },
      {
        type: 'text',
        required: true,
        message: 'Please specify the MySQL port (e.g., 3306)',
        name: 'MYSQL_PORT',
        validate: value => {
          try {
            const input = parseInt(value);
            if (isNaN(input)) return 'input must be numeric';
            z.number().min(0).max(65535).parse(input);
            return true;
          } catch (err) {
            if (err instanceof ZodError) {
              const zodError = err as ZodError;
              return zodError.issues[0].message;
            } else {
              return 'input must be numeric';
            }
          }
        },
      },
      {
        type: 'text',
        required: true,
        message: 'Please specify the MySQL username',
        name: 'MYSQL_USER',
      },
      {
        type: 'password',
        required: true,
        message: 'Please specify the MySQL password',
        name: 'MYSQL_PASS',
      },
      {
        type: 'text',
        required: true,
        message: 'Please specify the MySQL database name',
        name: 'MYSQL_DB',
      },
    ]);
    const spinner = createSpinner('Testing MySQL connection...').start();
    const db = new Database({
      host: mysqlPrompts.MYSQL_HOST,
      port: parseInt(mysqlPrompts.MYSQL_PORT),
      username: mysqlPrompts.MYSQL_USER,
      password: mysqlPrompts.MYSQL_PASS,
      database: mysqlPrompts.MYSQL_DB,
    });
    const connected = await db.connect();
    if (connected) {
      mysqlConnected = true;
      spinner.success({
        text: 'MySQL connection succeeded!',
      });
      await db.disconnect();
      addOptions(mysqlPrompts);
    } else {
      spinner.error({
        text: 'MySQL connection failed!',
      });
      await new Promise(res => setTimeout(res, 1000));
    }
  }

  const recordData: Record<string, string> = Object.fromEntries([...settings]);

  return recordData;
};
