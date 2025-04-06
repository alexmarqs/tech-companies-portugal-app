"use client";

import CountUp, { type CountUpProps } from "react-countup";

type AnimateNumberProps = CountUpProps;

export const AnimateNumber = ({ ...props }: AnimateNumberProps) => {
  return <CountUp {...props} />;
};
