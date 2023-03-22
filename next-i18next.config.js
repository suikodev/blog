const HttpBackend = require("i18next-http-backend/cjs");
const ChainedBackend = require("i18next-chained-backend").default;
const LocalStorageBackend = require("i18next-localstorage-backend").default;
const BrowserLanguageDetector =
  require("i18next-browser-languagedetector").default;

module.exports = {
  backend: {
    backendOptions: [{ expirationTime: 24 * 60 * 60 * 1000 }], //  1 day
    backends: [LocalStorageBackend, HttpBackend],
  },
  i18n: {
    defaultLocale: "zh",
    locales: ["zh", "en"],
  },
  detection: {
    order: ["cookie", "path", "navigator"],
    lookupCookie: "NEXT_LOCALE",
    lookupFromPathIndex: 0,
    cookieMinutes: 24 * 60 * 400,
    caches: ["cookie"],
  },
  defaultNS: "common",
  serializeConfig: false,
  debug: process.env.NODE_ENV !== "production",
  use:
    typeof window !== "undefined"
      ? [BrowserLanguageDetector, ChainedBackend]
      : [],
};
