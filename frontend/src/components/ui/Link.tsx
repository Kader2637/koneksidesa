import { Link as ReactRouterLink } from "react-router-dom";
import React from "react";

const Link = React.forwardRef<HTMLAnchorElement, any>(({ href, children, ...props }, ref) => {
  return (
    <ReactRouterLink to={href} ref={ref} {...props}>
      {children}
    </ReactRouterLink>
  );
});

Link.displayName = "Link";

export default Link;
