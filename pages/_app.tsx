import { AnimatePresence } from "framer-motion";
import { AppProps } from "next/app";
import Layout from "~/components/Layout";
import { appWithTranslation, SSRConfig, useTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config";
import { DefaultSeo } from "next-seo";
import "../styles/index.css";
import "../styles/code.css";
import { SITE_URL } from "~/lib/constants";
import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import isDark from "~/utils/isDark";

function MyApp({
  Component,
  pageProps,
  router,
}: AppProps<{ hideFooter?: boolean; hideHeader?: boolean }>) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (isDark()) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  return (
    <>
      <Layout
        hideFooter={pageProps.hideFooter}
        hideHeader={pageProps.hideFooter}
      >
        <DefaultSeo
          defaultTitle={t("title")}
          titleTemplate={`%s | ${t("title")}`}
          description={t("defaultDescription")}
          openGraph={{
            type: "website",
            locale: i18n.language,
            url: SITE_URL + router.asPath,
            site_name: t("title"),
            title: t("title"),
          }}
        />
        <AnimatePresence
          exitBeforeEnter
          initial={false}
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Layout>
      <Analytics />
    </>
  );
}

export default appWithTranslation<
  AppProps<{
    hideFooter: boolean;
    hideHeader: boolean;
    _nextI18Next: SSRConfig["_nextI18Next"];
  }>
>(MyApp, nextI18NextConfig);
