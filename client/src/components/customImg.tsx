import type { ImgHTMLAttributes, SyntheticEvent } from "react";
import { useRef } from "react";

type CustomImgProps = ImgHTMLAttributes<HTMLImageElement>;
type CustomImgPropsAdditional = {
  fallback?: string;
};

function CustomImg({
  className,
  src,
  fallback,
  ...props
}: CustomImgProps & CustomImgPropsAdditional) {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.preventDefault();
    const el = imgRef.current;
    if (!el) return;
    if (el.src.trim() === src?.trim() && fallback) {
      el.src = fallback;
    }
  };

  return (
    <img
      ref={imgRef}
      onError={handleError}
      className={className}
      src={src}
      {...props}
    />
  );
}
export default CustomImg;
