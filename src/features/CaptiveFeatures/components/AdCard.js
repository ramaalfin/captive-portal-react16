import React, { useState } from "react";

function AdCard(props) {
  const { ad, onSelect, urlMinioBanners, urlMinioVideos, urlMinioThumbnails } =
    props;

  const [imageLoaded, setImageLoaded] = useState(false);
  const imageSrc = ad.banner_url
    ? `${urlMinioBanners}/${ad.banner_url}`
    : ad.thumbnail_url
    ? `${urlMinioThumbnails}/${ad.thumbnail_url}`
    : "";

  return (
    <div
      key={ad.id}
      className="
        relative
        w-[85%] sm:w-[70%] md:w-64 lg:w-48
        h-64 sm:h-72 md:h-96
        rounded-xl overflow-hidden shadow-lg
        mx-auto
        transition-all duration-300
      "
    >
      <button
        onClick={() => onSelect(ad)}
        className="absolute top-2 right-2 bg-white px-4 py-2 rounded-full text-gray-800 text-sm font-bold shadow-lg cursor-pointer lg:text-base z-10"
      >
        Pilih
      </button>

      {!imageLoaded && (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse">
          <p className="text-xs text-gray-500">Memuat...</p>
        </div>
      )}

      {/* {ad.banner_url && ad.video_url ? (
        <img
          src={
            (urlMinioBanners ? urlMinioBanners : urlMinioThumbnails) +
            "/" +
            ad.banner_url
          }
          alt={ad.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      ) : ad.banner_url ? (
        <img
          src={
            (urlMinioBanners ? urlMinioBanners : urlMinioThumbnails) +
            "/" +
            ad.banner_url
          }
          alt={ad.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      ) : ad.video_url ? (
        <img
          src={urlMinioThumbnails + "/" + ad.thumbnail_url}
          alt={ad.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      ) : null} */}

      <img
        crossOrigin="anonymous"
        src={imageSrc}
        alt={ad.title}
        className={`
          w-full h-full object-contain
          transition-opacity duration-500
          ${imageLoaded ? "opacity-100" : "opacity-0"}
        `}
        onLoad={() => setImageLoaded(true)}
        loading="lazy"
      />

      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {ad.title}
      </div>
    </div>
  );
}

export default AdCard;
