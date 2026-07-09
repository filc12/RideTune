import Image from "next/image";

/** iPhone-style frame around a real app screenshot. */
export default function Phone({
  src,
  alt,
  width = 300,
}: {
  src: string;
  alt: string;
  width?: number;
}) {
  return (
    <div
      className="relative rounded-[3rem] border border-white/10 bg-gradient-to-b from-[#3a3f47] via-[#22262c] to-[#3a3f47] p-[8px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
      style={{ width }}
    >
      <div className="rounded-[2.6rem] bg-black p-[10px]">
        <div className="relative overflow-hidden rounded-[2rem]">
          {/* dynamic island */}
          <div className="absolute left-1/2 top-2 z-10 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
          <Image
            src={src}
            alt={alt}
            width={640}
            height={1310}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
