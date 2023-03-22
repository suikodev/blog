import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { HomeIcon, ArrowCircleLeftIcon } from "@heroicons/react/solid";

const PageNotFound = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  let helperText = t("pageNotFound");
  switch (true) {
    case router.asPath.startsWith("/blog"):
      helperText = t("postNotFound");
      break;
  }
  return (
    <div className="hero min-h-screen bg-base-100 text-base-content">
      <div className="hero-content text-center">
        <div>
          <h1 className="text-9xl font-bold text-gradient-to-b from-secondary to-primary">
            404
          </h1>
          <p className="text-3xl font-light leading-10">
            <span className="text-gradient-to-b from-secondary to-primary">
              {helperText}
            </span>{" "}
            <span className="text">😢</span>
          </p>

          <div className="space-x-2">
            <button
              className="btn btn-primary mt-16"
              onClick={() => {
                router.back();
              }}
              aria-label={t("goBack")}
            >
              <ArrowCircleLeftIcon className="w-6 h-6 mr-2" />
              {t("goBack")}
            </button>
            <button
              className="btn btn-primary btn-outline mt-16"
              onClick={() => {
                router.push("/", undefined, {
                  locale: i18n.language,
                });
              }}
              aria-label={t("backToHome")}
            >
              <HomeIcon className="w-6 h-6 mr-2" />
              {t("goHome")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      hideFooter: true,
      hideHeader: true,
    },
  };
}

export default PageNotFound;
