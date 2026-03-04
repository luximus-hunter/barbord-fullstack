import {
  Link,
  Outlet,
  createRootRoute,
  useNavigate,
} from "@tanstack/solid-router";
import { RootErrorPage } from "../errorPages/rootError";
import { gateway } from "../gateway";

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: (error) => <RootErrorPage error={error} />,
});

function RootComponent() {
  const navigate = useNavigate();

  return (
    <>
      <nav>
        <Link to="/">Shop</Link>
        <Link to="/users">Users</Link>

        <Link to="/login">Login</Link>
        <span
          on:click={async () => {
            await gateway()!.auth.logout();
            navigate({ to: "/" });
          }}
        >
          Logout
        </span>
      </nav>
      <hr />
      <Outlet />
    </>
  );
}
