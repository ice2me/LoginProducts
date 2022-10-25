export const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? "https://saasdev.site/api"
    : `${window.location.origin}/api`;

export const makeUrl = (urlSuff) => `${apiBaseUrl}/${urlSuff}`;
