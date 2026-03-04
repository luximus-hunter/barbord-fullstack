import { createSignal } from "solid-js";
import { z } from "zod";

export function useZodForm<T extends z.ZodType>(
  schema: T,
  options: {
    initialValues: z.infer<T>;
    onSubmit: (data: z.infer<T>) => Promise<void>;
    onSuccess?: () => void;
  },
) {
  const [form, setForm] = createSignal<z.infer<T>>(options.initialValues);
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [loading, setLoading] = createSignal(false);
  const [serverError, setServerError] = createSignal<string | null>(null);

  const handleInput = (e: Event, field: keyof z.infer<T>) => {
    const target = e.target as HTMLInputElement;
    //@ts-ignore
    setForm((prev) => ({ ...prev, [field]: target.value }));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    const result = schema.safeParse(form());

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      await options.onSubmit(result.data);

      if (options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);

      setServerError(
        error instanceof Error ? error.message : "An error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    loading,
    serverError,
    handleInput,
    handleSubmit,
  };
}
