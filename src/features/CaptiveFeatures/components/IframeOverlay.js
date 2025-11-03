import React, { useEffect, useRef, useState } from "react";

const IframeOverlay = ({ url, open, onClose, sandbox = null, onClaim }) => {
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setTimedOut(false);

    // Jika iframe diblokir oleh X-Frame-Options/CSP, load event mungkin tidak pernah terpanggil.
    // Pakai timeout untuk menampilkan fallback UI.
    timerRef.current = window.setTimeout(() => {
      setTimedOut(true);
      setLoading(false);
    }, 4000);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90"
      style={{ backdropFilter: "blur(2px)" }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-[92vw] h-[82vh] bg-white/5 rounded-lg overflow-hidden shadow-2xl border border-white/10 relative">
          {/* <div className="absolute top-0 left-0 right-0 h-10 bg-black/70 text-white text-xs flex items-center justify-between px-3 z-10">
            <button
              onClick={onClaim}
              className=" bg-white px-4 py-2 rounded-full text-foreground font-semibold shadow-lg lg:text-base mt-4"
            >
              <p className="text-sm">Klaim Internet</p>
            </button>
          </div> */}

          {/* Iframe konten */}
          <iframe
            src={url}
            title="Advertiser"
            className="w-full h-full"
            style={{ border: "none" }}
            sandbox={
              sandbox ??
              "allow-scripts allow-same-origin allow-forms allow-popups"
            }
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; geolocation; gyroscope; picture-in-picture"
            referrerPolicy="no-referrer"
            onLoad={() => {
              setLoading(false);
              if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
              }
            }}
          />

          {/* Fallback jika diblokir */}
          {timedOut && (
            <div className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center gap-3 p-4 text-center">
              <p className="text-sm">
                Halaman ini menolak ditampilkan di dalam iframe
                (X-Frame-Options/CSP).
              </p>
              <p className="text-xs opacity-80">
                Jika tetap ingin melihat konten, buka di tab baru.
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 bg-white text-black px-3 py-1 rounded-full text-sm"
              >
                Buka di Tab Baru
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IframeOverlay;
