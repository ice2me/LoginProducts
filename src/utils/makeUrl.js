export const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://dummy-api.d0.acom.cloud/api/"
    : `${window.location.origin}/api`;

export const makeUrl = (urlSuff) => `${apiBaseUrl}/${urlSuff}`;
