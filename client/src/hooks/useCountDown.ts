import { useEffect, useState } from "react";

export const useCountDown = () => {
  const [countDown, setCountDown] = useState<number>(0);

  useEffect(() => {
    if (countDown === 0) return;
    if (countDown < 0) setCountDown(0);
    const interval = setInterval(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countDown]);
  return { countDown, setCountDown };
};
