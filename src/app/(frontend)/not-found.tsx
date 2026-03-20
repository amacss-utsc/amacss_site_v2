import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md text-center">
        <h1 className="mb-2 text-6xl font-extrabold leading-tight text-white">
          404
        </h1>
        <p className="mb-6 text-lg text-white">
          This page could not be found.
        </p>
        <div>
          <Link
            href="/"
            className="text-sm text-purple-600 underline"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
