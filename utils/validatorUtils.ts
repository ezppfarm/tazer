import {z} from 'zod';

export const usernameValidator = z
  .string({
    required_error: 'Username is required',
    invalid_type_error: 'Username must be a string',
  })
  .max(16, {message: 'Must be 16 or fewer characters long'})
  .min(3, {
    message: 'Must be 3 or more characters long',
  })
  .refine(value => !value.includes(' ') && !value.includes('_'), {
    message:
      'Username may contain spaces and underscores, but not both at the same time',
  });

export const passwordValidator = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(8, {
    message: 'Must be 8 or more characters long',
  })
  .max(512, {message: 'Must be 16 or fewer characters long'})
  .refine(
    value => {
      const hasUppercase = /[A-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSymbol = /[!@#$%^&*()_+{}\\[\]:;<>,.?~\\-]/.test(value);
      return hasUppercase && hasNumber && hasSymbol;
    },
    {
      message:
        'Password must contain at least one uppercase letter, one number, and one symbol',
    }
  );

export const emailValidator = z
  .string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
  .email({
    message: 'The provided email is not a valid',
  });

export const domainValidator = z
  .string({
    required_error: 'Domain is required',
    invalid_type_error: 'Domain must be a string',
  })
  .refine(
    value =>
      /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(
        value
      ),
    {
      message: 'Domain must be a valid one.',
    }
  );
