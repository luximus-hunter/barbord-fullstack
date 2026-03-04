type FormFieldProps = {
  type: HTMLInputElement["type"];
  label: string;
  name: string;
  value: string;
  handleInput: (e: Event, field: string) => void;
  errors: () => Record<string, string | undefined>;
};

export function FormField({
  label,
  name,
  type,
  value,
  handleInput,
  errors,
}: FormFieldProps) {
  return (
    <div>
      <label>{label}</label>
      <input type={type} value={value} onInput={(e) => handleInput(e, name)} />
      {errors()[name] && <p>{errors()[name]}</p>}
    </div>
  );
}
