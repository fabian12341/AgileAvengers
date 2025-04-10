import React from 'react';

const MockLink = ({ children, href, ...props }) => {
  return <a href={href} {...props}>{children}</a>;
};

export default MockLink;