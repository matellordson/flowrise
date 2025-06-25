import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

export const authClient = createAuthClient({
  //you can pass client configuration here
  baseURL:
    "https://fantastic-rotary-phone-97qq9x55pj6pc75pp-3000.app.github.dev",
});
