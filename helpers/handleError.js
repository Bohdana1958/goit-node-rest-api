export const handleError = (error, next) => {
  error.status = 400;
  next();
};
