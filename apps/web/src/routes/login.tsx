import { LoginDTO } from "@repo/contract";
import { useZodForm } from "../lib/useZodForm";
import { router } from "../router";
import { createFileRoute } from "@tanstack/solid-router";
import { FormField } from "../components/ui/form-field";
import { useQuery } from "@tanstack/solid-query";
import { Show } from "solid-js";
import { Gateway } from "@repo/gateway";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const adminQuery = useQuery(() => ({
    queryKey: ["admin"],
    queryFn: () => Gateway.admins.get(),
  }));

  const { form, errors, loading, serverError, handleInput, handleSubmit } =
    useZodForm(LoginDTO, {
      initialValues: {
        username: "",
        password: "",
      },
      onSubmit: async (data) => {
        await Gateway.auth.login(data);
      },
      onSuccess: () => {
        router.navigate({ to: "/users" });
      },
    });

  return (
    <>
      <div>LOGIN PAGE</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label for="username">Username</label>

          <Show when={adminQuery.isPending}>
            <p>Loading...</p>
          </Show>

          <Show when={adminQuery.isError}>
            <p>Error loading admins</p>
          </Show>

          <Show when={adminQuery.data}>
            {(admins) => (
              <select
                id="username"
                name="username"
                value={form().username}
                on:change={(e) => handleInput(e, "username")}
              >
                <option value="" disabled>
                  Select an admin
                </option>
                {admins().map((admin) => (
                  <option value={admin.username}>{admin.displayname}</option>
                ))}
              </select>
            )}
          </Show>
        </div>

        <FormField
          label="Password"
          name="password"
          type="new-password"
          value={form().password}
          handleInput={(e) => handleInput(e, "password")}
          errors={errors}
        />

        {serverError() && <p>{serverError()}</p>}

        <button type="submit" disabled={loading()}>
          {loading() ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
}
