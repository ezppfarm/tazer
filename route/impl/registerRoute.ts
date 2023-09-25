import { FastifyReply, FastifyRequest } from "fastify";
import { RequestType } from "../requestType";
import routeHandler from "../routeHandler";
import { toSafeUsername } from "../../utils/userUtils";
import { refresh_tokens, sessions } from "../../consts/cache";
import { Session } from "../../objects/session";
import { generateBearerToken } from "../../utils/stringUtils";
import { UserRegisterStruct } from "../../types/UserRegisterStruct";
import { emailValidator, passwordValidator, usernameValidator } from "../../utils/validatorUtils";
import { ZodError } from "zod";

export default class oAuthRoute implements routeHandler {
  path = "/users";
  requestTypes = [RequestType.POST];
  async handle(
    request: FastifyRequest,
    response: FastifyReply,
  ): Promise<unknown> {
    response.type("application/json");
    console.log(request.body);

    const registerRequest = request.body as UserRegisterStruct;
    let username = "";
    let password = "";
    let email = "";

    let form_error: Record<string, unknown> = {};

    try {
      username = await usernameValidator.parseAsync(registerRequest["user[username]"].value);
    } catch (err) {
      const zodError = err as ZodError;
      form_error["username"] = zodError.errors.map(error => error.message);
    }

    try {
      password = await passwordValidator.parseAsync(registerRequest["user[password]"].value);
    } catch (err) {
      const zodError = err as ZodError;
      form_error["password"] = zodError.errors.map(error => error.message);
    }

    try {
      email = await emailValidator.parseAsync(registerRequest["user[user_email]"].value);
    } catch (err) {
      const zodError = err as ZodError;
      form_error["user_email"] = zodError.errors.map(error => error.message);
    }

    if (Object.keys(form_error).length > 0) {
      response.code(400);
      return JSON.stringify({
        form_error: {
          user: form_error
        }
      })
    };

    console.log("registering " + username)


    return {};
  }
}
