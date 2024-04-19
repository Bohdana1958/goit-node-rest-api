export const joiValidator = (schema) => (data) => {
  const { error, value } = schema(data);

  if (!error) return { value };

  return {
    value,
    errors: error.details.map((err) => err.message),
  };
};
