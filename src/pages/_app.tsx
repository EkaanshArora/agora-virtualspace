import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import RouteValidatorAuth from "../components/RouteValidator";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <RouteValidatorAuth>
        <Component {...pageProps} />
      </RouteValidatorAuth>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
