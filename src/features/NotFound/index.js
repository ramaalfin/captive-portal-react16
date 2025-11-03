import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md text-center space-y-6">
        <img
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGNseTdxNWFtZnhmdXVrYm1nNGZqb3Q0cXJlbWUyejN4M3l1ODdoYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Lq0h93752f6J9tijrh/giphy.gif"
          alt=""
          className="cursor-disable mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold text-gray-700">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-600">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <button asChild>
          <a href="/captive" className="mt-4 inline-block">
            Kembali ke Beranda
          </a>
        </button>
      </div>
    </div>
  );
}
