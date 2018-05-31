const globalParameters = (method = 'GET', data = null, cors = true, credentials = true) => {
  return {
    method,
    ...(cors ? { mode: 'cors' } : {}),
    ...(credentials ? { credentials: 'include' } : {}),
    cache: 'default',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    ...(data ? { body: JSON.stringify({ ...data }) } : {}),
  }
}

export {
  globalParameters,
};
