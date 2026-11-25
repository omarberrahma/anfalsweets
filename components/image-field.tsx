"use client";

import { useState } from "react";

const PRESETS = [
  "/images/anfal-cover.jpg",
  "/images/cake-chocolate.jpg",
  "/images/cake-redvelvet.jpg",
  "/images/cupcakes.jpg",
  "/images/wedding-cake.jpg",
  "/images/traditional-cover.jpg",
  "/images/baklawa.jpg",
  "/images/makroud.jpg",
  "/images/ghribia.jpg",
  "/images/kaak.jpg",
];

export function ImageField({
  name = "image_url",
  defaultValue = "",
  label = "رابط الصورة",
}: {
  name?: string;
  defaultValue?: string;
  label?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <div className="flex gap-3">
        <div className="grid h-20 w-20 flex-shrink-0 place-items-center overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 text-stone-300">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <i className="fa-regular fa-image text-xl" />
          )}
        </div>
        <input
          id={name}
          name={name}
          dir="ltr"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="/images/cake-chocolate.jpg أو https://..."
          className="input ltr:text-left"
        />
      </div>
      <p className="mt-2 text-[11px] font-bold text-stone-400">ولا اختر من الصور الجاهزة:</p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {PRESETS.map((src) => (
          <button
            key={src}
            type="button"
            onClick={() => setValue(src)}
            className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
              value === src ? "border-brand-500 ring-2 ring-brand-100" : "border-transparent opacity-80 hover:opacity-100"
            }`}
            title="استعمال هذه الصورة"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
