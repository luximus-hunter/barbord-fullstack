import { createFileRoute } from "@tanstack/solid-router";
import { useQuery } from "@tanstack/solid-query";
import { gateway } from "../gateway";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const shopQuery = useQuery(() => ({
    queryKey: ["shop"],
    queryFn: () => gateway()!.shop.getShopData(),
    staleTime: 1000 * 60, // 1 minute
    enabled: !!gateway,
  }));

  return (
    <>
      <div>SHOP PAGE</div>
      <button onClick={() => shopQuery.refetch()}>Refresh</button>
      {shopQuery.isPending && <p>Loading...</p>}
      {shopQuery.error && <p>Error</p>}
      <pre>{JSON.stringify(shopQuery.data, null, 2)}</pre>
    </>
  );
}
