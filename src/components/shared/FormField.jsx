function FormField({
  id,
  label,
  type = "text",
  error,
  disabled = false,
  placeholder,
  register,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-gray mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...register}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent placeholder-gray disabled:opacity-60"
      />
      {error && <p className="text-error text-xs mt-1">{error.message}</p>}
    </div>
  );
}

export default FormField;
