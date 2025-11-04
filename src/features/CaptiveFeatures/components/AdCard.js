import React from "react";

function AdCard(props) {
  const { ad, onSelect, urlMinioBanners, urlMinioVideos, urlMinioThumbnails } =
    props;

  return (
    <div
      key={ad.id}
      className="relative w-full lg:w-48 h-80 rounded-lg overflow-hidden shadow-lg"
    >
      <button
        onClick={() => onSelect(ad)}
        className="absolute top-2 right-2 bg-white px-4 py-2 rounded-full text-gray-800 text-sm font-bold shadow-lg cursor-pointer lg:text-base z-10"
      >
        Pilih
      </button>

      {/* Case 3: Ada banner & video */}
      {ad.banner_url && ad.video_url ? (
        <img
          src={
            (urlMinioBanners ? urlMinioBanners : urlMinioThumbnails) +
            "/" +
            ad.banner_url
          }
          alt={ad.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : ad.banner_url ? (
        // Case 1: Hanya banner
        <img
          src={
            (urlMinioBanners ? urlMinioBanners : urlMinioThumbnails) +
            "/" +
            ad.banner_url
          }
          alt={ad.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : ad.video_url ? (
        // Case 2: Hanya video → tampilkan thumbnail-nya
        <img
          src={urlMinioThumbnails + "/" + ad.thumbnail_url}
          alt={ad.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : null}

      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {ad.title}
      </div>
    </div>
  );
}

export default AdCard;
