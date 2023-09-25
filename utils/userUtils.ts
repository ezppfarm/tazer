export const toSafeUsername = (username: string) => {
  return username.toLowerCase().replace(" ", "_");
};
