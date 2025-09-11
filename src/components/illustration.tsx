import Image from "next/image";

type Position = "bottom-left" | "bottom-center" | "bottom-right";

interface IllustrationProps {
  src: string;
  alt?: string;
  position?: Position;
  width?: number;
  height?: number;
  className?: string;
}

const positionClasses: Record<Position, string> = {
  "bottom-left": "left-4",
  "bottom-center": "left-1/2 transform -translate-x-1/2",
  "bottom-right": "right-4",
};

export default function Illustration({
  src,
  alt = "",
  position = "bottom-center",
  width = 128,
  height = 128,
  className,
}: IllustrationProps) {
  return (
    <div className={`absolute bottom-4 ${positionClasses[position]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
              height={height}
              layout="responsive"
        className="object-contain"
        priority
      />
    </div>
  );
}
