interface FieldMessageProps {
  errorMessage?: string;
  helperText?: string;
}

function FieldMessage({ errorMessage, helperText }: FieldMessageProps) {
  const message = errorMessage ? (
    <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
  ) : (
    <p className="mt-1 text-sm text-gray-600">{helperText}</p>
  );

  return message;
}

export default FieldMessage;
