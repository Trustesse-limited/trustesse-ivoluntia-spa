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
    <div className={`absolute bottom-4 ${positionClasses[position]} ${className} w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
