import React from 'react';

const MockImage = ({ src, alt, width, height, className, ...props }) => {
  return <img src={src} alt={alt} width={width} height={height} className={className} {...props} />;
};

export default MockImage;