import {
  Link,
  Outlet,
  createRootRoute,
  useNavigate,
} from "@tanstack/solid-router";
import { Gateway } from "@repo/gateway";

export const Route = createRootRoute({
  component: RootComponent,
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
            await Gateway.auth.logout();
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
