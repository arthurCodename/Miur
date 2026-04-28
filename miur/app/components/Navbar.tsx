"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full h-20  flex items-center justify-between px-4 font-medium tracking-wide text-sm bg-gradient-to-b from-white/20 to-transparent">
      <div className="flex items-center gap-6">
        <button
          aria-label="Open Menu"
          className="flex flex-col gap-1.5 cursor-pointer"
        >
          <span className="block h-0.5 w-6 bg-black"></span>
          <span className="block h-0.5 w-6 bg-black"></span>
          <span className="block h-0.5 w-6 bg-black"></span>
        </button>
        <Link href="/sale">Sale</Link>
        <button
          className="cursor-pointer"
          onClick={() => console.log("search")}
        >
          Search
        </button>
      </div>
      <div>
        <Link href="/">
          <Image
            src="/logo.jpg"
            alt="Miur Logo"
            className="w-32 h-auto mix-blend-multiply"
            width={100}
            height={40}
          />
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/account">Account</Link>
        <Link href="/wishlist">Wishlist</Link>
        <Link href="/cart">Cart</Link>
      </div>
    </nav>
  );
}
