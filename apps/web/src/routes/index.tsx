import { createFileRoute } from "@tanstack/solid-router";
import { useQuery } from "@tanstack/solid-query";
import { Gateway } from "@barbord/gateway";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const shopQuery = useQuery(() => ({
    queryKey: ["shop"],
    queryFn: () => Gateway.shop.getShopData(),
    staleTime: 1000 * 60, // 1 minute
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
