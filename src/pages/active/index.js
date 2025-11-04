import React, { useEffect } from "react";

export default function ActivePage() {
  useEffect(() => {
    // Pastikan scroll posisi ke atas & background tetap terang
    window.scrollTo(0, 0);
    document.body.style.backgroundColor = "#fafafa";
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#222",
        textAlign: "center",
        padding: "16px",
      }}
    >
      {/* Lingkaran Hijau Putih */}
      <div
        style={{
          padding: "16px",
          borderRadius: "50%",
          backgroundColor: "#17B978",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            padding: "12px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#17B978"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Teks Internet Aktif */}
      <p style={{ fontSize: "18px", fontWeight: 600, marginBottom: "32px" }}>
        Internet Aktif
      </p>

      {/* Footer bawah */}
      <div
        style={{
          position: "fixed",
          bottom: "12px",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "12px",
          color: "#555",
        }}
      >
        Powered by Varnion
      </div>
    </div>
  );
}
