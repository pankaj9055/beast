export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123"
};

export const isValidAdmin = (username: string, password: string): boolean => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
};
