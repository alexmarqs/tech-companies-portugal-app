"use client";

import { TypeAnimation } from "react-type-animation";

export const AnimatedCompaniesFeatures = () => {
  return (
    <TypeAnimation
      sequence={[
        "Discover future opportunities",
        1800,
        "Discover tech potential",
        1800,
        "Discover dream roles",
        1800,
        "Discover remote possibilities",
        1800,
        "Discover industry leaders",
        1800,
      ]}
      wrapper="h2"
      speed={40}
      preRenderFirstString={true}
      className="font-semibold font-mono text-xl md:text-2xl"
      repeat={Infinity}
    />
  );
};
