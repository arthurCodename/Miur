import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, rgb(39, 39, 42) 0%, rgb(9, 9, 11) 55%, rgb(0, 0, 0) 100%)",
        }}
      >
        <div tw="flex flex-col items-center justify-center px-16 text-center">
          <p tw="text-8xl font-bold tracking-tight text-white">Miur Wellness Store</p>
          <p tw="mt-8 text-4xl text-zinc-300">Najlepsze produkty dla Ciebie</p>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
