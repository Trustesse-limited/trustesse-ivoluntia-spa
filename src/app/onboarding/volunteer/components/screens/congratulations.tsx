import Image from "next/image";
import { BRAND_NAME } from "@/app/data";
import { Button } from "@/components/ui/button";

export default function Congratulations() {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-3 pb-20">
        <Image
          src={"/success.svg"}
          alt="success"
          height={200}
          width={200}
          className="mb-2"
        />
        <b className="font-bold text-3xl md:text-4xl text-[#2C2C2C]">Congratulations</b>
        <p className="text-center font-semibold text-[#818181] text-base sm:text-lg">
          You have completed onboarding, your account is under review. Go ahead
          and explore {BRAND_NAME}
        </p>
        <Button variant="default" className="font-bold text-white w-full h-12 text-lg">Launch</Button>
      </div>
    );
}