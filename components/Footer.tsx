import Container from "./Container";
import { AUTHOR_NAME, FRIEND_LINKS } from "../lib/constants";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-primary text-secondary dark:text-primary-content">
      <Container>
        <div className="py-16 flex items-center justify-center flex-col gap-4">
          <p className="text-xl font-extrabold">
            © {new Date().getFullYear()} {AUTHOR_NAME}. All rights reserved.
          </p>
          <div className="max-w-sm text-center">
            <p className="text-lg">
              {t("linksPageTitle", { author: AUTHOR_NAME })}:
            </p>
            <p className="flex flex-wrap gap-x-2 justify-center">
              {FRIEND_LINKS.map((i) => (
                <a
                  target="_blank"
                  key={i.link}
                  href={i.link}
                  rel="noreferrer"
                  className="link"
                >
                  {i.name}
                </a>
              ))}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
