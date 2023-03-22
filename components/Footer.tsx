import Container from "./Container";
import { AUTHOR_NAME, FRIEND_LINKS } from "../lib/constants";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="from-secondary to-primary text-secondary-content bg-gradient-to-br">
      <Container>
        <div className="py-16 flex items-center justify-center flex-col gap-3">
          <p className="text-xl font-extrabold">
            © {new Date().getFullYear()} {AUTHOR_NAME}. All rights reserved.
          </p>
          <div className="max-w-sm text-center">
            <p className="text-lg font-bold">
              {t("linksPageTitle", { author: AUTHOR_NAME })}:
            </p>
            <p className="flex flex-wrap gap-2 justify-center">
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
