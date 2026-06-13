declare module "next/image" {
  import React from "react";
  interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
  }
  const Image: React.ComponentType<ImageProps>;
  export default Image;
}

declare module "next/link" {
  import React from "react";
  interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children?: React.ReactNode;
  }
  const Link: React.ComponentType<LinkProps>;
  export default Link;
}
