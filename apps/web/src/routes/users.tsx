import { useQuery } from "@tanstack/solid-query";
import { createFileRoute } from "@tanstack/solid-router";
import { gateway } from "../gateway";

export const Route = createFileRoute("/users")({
  component: UsersPage,
});

function UsersPage() {
  const usersQuery = useQuery(() => ({
    queryKey: ["users"],
    queryFn: () => gateway()!.users.get(),
    staleTime: 1000 * 60, // 1 minute
    enabled: !!gateway(),
  }));

  return (
    <>
      <div>USERS PAGE</div>
      {usersQuery.isPending && <p>Loading...</p>}
      {usersQuery.error && <p>Error</p>}
      <pre>{JSON.stringify(usersQuery.data, null, 2)}</pre>
    </>
  );
}
