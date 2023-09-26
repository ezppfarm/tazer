import { database } from '../glob';
import { User } from '../objects/user';
import { DBUser } from '../types/DBUser';
import { createPassword } from '../utils/passwordUtils';
import { getCountryCode } from '../utils/gelocUtils';

export const getUser = async (id: number) => {
  const db = await database();
  if (!db) return undefined;
  const selectedUser = await db("users").where("id", id).limit(1);
  if (!selectedUser) return;
  const user: DBUser = selectedUser[0];
  return new User(user);
}

export const insertUser = async (username: string, username_safe: string, password: string, email: string, ip: string): Promise<{ type: "error" | "success", message: string } | undefined> => {
  //Check if username or email is already used.
  const db = await database();
  if (!db) return undefined;
  const userCheck = await db("users").where("name", username).orWhere("safe_name", username_safe).orWhere("email", email).limit(1);
  if (!userCheck) return {
    type: "error",
    message: "Username or Email is already registered!"
  };

  const countryCode = await getCountryCode(ip);
  console.log(ip, countryCode);

  await db("users").insert({
    name: username,
    safe_name: username_safe,
    email: email,
    password: await createPassword(password),
    country: countryCode,
    join_time: new Date(),
    last_activity: new Date()
  })

  //TODO: Insert into stats table

  return {
    type: "success",
    message: "successfully registered as " + username
  };
}
