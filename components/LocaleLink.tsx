import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";

interface IProps extends LinkProps {
  children: ReactNode;
}

const LocaleLink = ({
  children,
  href,
  passHref,
  ...restProps
}: IProps): JSX.Element => {
  return (
    <Link href={href} passHref={passHref} {...restProps}>
      {children}
    </Link>
  );
};

export default LocaleLink;
