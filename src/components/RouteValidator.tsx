import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

type Props = {
  children: React.ReactElement;
};

const Loading = () => (
  <div>loading...</div>
);

const RouteValidatorAuth: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { status } = useSession();
  const authRoutes = ["/", "/_error"];

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated" && !authRoutes.includes(router.pathname)) {
    void signIn()
    return <></>
  }

  return children
};

export default RouteValidatorAuth;
