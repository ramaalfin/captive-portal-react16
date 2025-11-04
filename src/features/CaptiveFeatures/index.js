import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCaptiveAds, viewVideo } from "../../store/action/captiveActions";
import AdCard from "./components/AdCard";
import { resetCaptiveClick } from "../../store/reducers/captiveClickReducer";
import { UAParser } from "ua-parser-js";
import { useHistory, useLocation } from "react-router-dom";
import { fetchUserLogin } from "../../store/action/userLoginActions";
import { postToMikrotikLogin } from "../../utils/mikrotikLogin";
import { FaGift } from "react-icons/fa";

export default function CaptiveFeatures() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  // --- search params manual karena belum ada useSearchParams di v5
  const params = new URLSearchParams(location.search);
  const chapId = params.get("chap-id");
  const chapChallenge = params.get("chap-challenge");
  const mac = params.get("mac");
  const ip = params.get("ip");
  const username = params.get("username");
  const linkOrig = params.get("link-orig");
  const dst = params.get("dst");
  const errorURL = params.get("error");
  const session = params.get("session");
  const linkLoginOnly = params.get("link-login-only");

  const { ads, loading, error } = useSelector((state) => state.captiveAds);
  const { data: userLogin } = useSelector((state) => state.userLogin);

  const [selectedAd, setSelectedAd] = useState(null);
  const [modalStep, setModalStep] = useState(null);
  const [bannerCounter, setBannerCounter] = useState(10);
  const [isBannerFinished, setIsBannerFinished] = useState(false);
  const [showClaimButton, setShowClaimButton] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isPortrait, setIsPortrait] = useState(null);
  const [videoSize, setVideoSize] = useState(null);

  const videoRef = useRef(null);
  const claimTimeoutIdRef = useRef(null);
  const thresholdSecRef = useRef(0);

  const urlMinioBanners = process.env.REACT_MINIO_BANNERS || "";
  const urlMinioVideos = process.env.REACT_MINIO_VIDEOS || "";
  const urlMinioThumbnails = process.env.REACT_MINIO_THUMBNAILS || "";

  // --- detect device/browser
  const parser = new UAParser();
  const result = parser.getResult();

  const brand =
    result.device.vendor || (result.os.name === "iOS" ? "Apple" : "Unknown");
  const device = result.device.model || "Unknown";
  const os = result.os.name || "Unknown";
  const browser = result.browser.name || "Unknown";

  // --- fetch data awal
  useEffect(() => {
    dispatch(fetchCaptiveAds());
    dispatch(resetCaptiveClick());
    dispatch(fetchUserLogin());
  }, [dispatch]);

  const clearClaimTimeout = () => {
    if (claimTimeoutIdRef.current) {
      clearTimeout(claimTimeoutIdRef.current);
      claimTimeoutIdRef.current = null;
    }
  };

  const resetVideoStates = () => {
    clearClaimTimeout();
    thresholdSecRef.current = 0;
    setShowClaimButton(false);
    setVideoEnded(false);
  };

  const handleAdSelect = (ad) => {
    setSelectedAd(ad);
    setModalStep(null);
    setBannerCounter(10);
    setIsBannerFinished(false);
    resetVideoStates();
    dispatch(resetCaptiveClick());

    if (ad.banner_url && ad.video_url) {
      setModalStep("banner");
    } else if (ad.video_url && !ad.banner_url) {
      setModalStep("video");
    } else if (ad.banner_url && !ad.video_url) {
      setModalStep("banner");
    }
  };

  // --- banner countdown
  useEffect(() => {
    if (
      modalStep === "banner" &&
      selectedAd &&
      selectedAd.banner_url &&
      bannerCounter > 0 &&
      !isBannerFinished
    ) {
      const intervalId = setInterval(() => {
        setBannerCounter((prev) => {
          if (prev <= 1) {
            setIsBannerFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [modalStep, selectedAd, bannerCounter, isBannerFinished]);

  const handleBannerLanjut = () => {
    setIsBannerFinished(false);
    setBannerCounter(10);
    if (selectedAd && selectedAd.banner_url && selectedAd.video_url) {
      resetVideoStates();
      setModalStep("video");
    } else {
      handleClaimInternet(false);
    }
  };

  // --- handle video
  useEffect(() => {
    if (!videoRef.current) return;
    const videoEl = videoRef.current;

    videoEl
      .play()
      .then(() => {
        videoEl.muted = false;
        videoEl.volume = 1;
      })
      .catch((err) => {
        console.log("Autoplay gagal:", err);
      });
  }, [selectedAd]);

  useEffect(() => {
    if (
      modalStep !== "video" ||
      !selectedAd ||
      !selectedAd.video_url ||
      !videoRef.current
    )
      return;

    const videoEl = videoRef.current;

    const onLoadedData = () => {
      const dur = Math.ceil(videoEl.duration || 0);
      const w = videoEl.videoWidth || 0;
      const h = videoEl.videoHeight || 0;
      setVideoSize({ w, h });
      setIsPortrait(h > w);

      thresholdSecRef.current = selectedAd.skippable ? Math.ceil(dur / 2) : dur;

      clearClaimTimeout();
      setShowClaimButton(false);
      setVideoEnded(false);

      if (selectedAd.skippable) {
        claimTimeoutIdRef.current = setTimeout(function () {
          setShowClaimButton(true);
        }, thresholdSecRef.current * 1000);
      }
    };

    const onEnded = () => {
      setVideoEnded(true);
      setShowClaimButton(true);
      clearClaimTimeout();
    };

    videoEl.addEventListener("loadeddata", onLoadedData);
    videoEl.addEventListener("ended", onEnded);

    return () => {
      videoEl.removeEventListener("loadeddata", onLoadedData);
      videoEl.removeEventListener("ended", onEnded);
      clearClaimTimeout();
    };
  }, [modalStep, selectedAd]);

  const handleClaimInternet = async (skip) => {
    try {
      const payload = {
        ad_id: selectedAd ? selectedAd.id : "",
        brand,
        browser,
        device,
        os,
        is_skip: !!skip,
      };

      await dispatch(viewVideo(payload));

      if (linkLoginOnly && userLogin && userLogin.data) {
        postToMikrotikLogin(linkLoginOnly, {
          username: userLogin.data.username,
          password: userLogin.data.password,
          dst: userLogin.data.dst || linkOrig || dst || undefined,
          popup: true,
        });
        return;
      } else {
        history.push("/");
      }
    } catch (error) {
      console.error("Terjadi kesalahan di handleClaimInternet:", error);
      history.push("/");
    } finally {
      setSelectedAd(null);
      setModalStep(null);
      dispatch(resetCaptiveClick());
      resetVideoStates();
    }
  };

  // --- style video container
  const containerClass = isPortrait ? "video-portrait" : "video-landscape";

  // --- render section
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto pb-28 lg:pb-32 lg:py-8">
        <div className="flex flex-col min-h-screen justify-center items-center">
          <p>Memuat iklan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Gagal memuat iklan: {error}</p>
        <button onClick={() => dispatch(fetchCaptiveAds())}>Coba Lagi</button>
      </div>
    );
  }

  // --- banner
  if (modalStep === "banner" && selectedAd && selectedAd.banner_url) {
    return (
      <div
        className="absolute inset-0 w-full h-full p-4 flex justify-center items-center"
        style={{ backgroundColor: "#0E0E0E" }}
      >
        <div className="flex flex-col">
          <img
            src={urlMinioBanners + "/" + selectedAd.banner_url}
            alt={selectedAd.title}
            className="w-64 h-[30rem] object-contain mb-2 rounded-lg sm:w-72 lg:w-80"
          />
          <div
            className="w-full flex flex-row justify-between"
            style={{ backgroundColor: "#0E0E0E" }}
          >
            {bannerCounter > 0 && (
              <p className="flex items-center justify-center border border-white rounded-full text-white w-10 h-10 mt-2">
                {bannerCounter}
              </p>
            )}
            {isBannerFinished && (
              <button
                onClick={handleBannerLanjut}
                className="absolute right-10 top-0 bg-white px-4 py-2 rounded-full text-foreground font-semibold shadow-lg lg:text-base mt-4"
              >
                {selectedAd.video_url ? "Lanjut" : "Klaim Internet"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- video
  if (modalStep === "video" && selectedAd && selectedAd.video_url) {
    const skipAvailable =
      selectedAd.skippable && showClaimButton && !videoEnded;
    return (
      <div
        className="absolute inset-0 w-full h-full p-4 flex justify-center items-center"
        style={{ backgroundColor: "#0E0E0E" }}
      >
        <div className="flex flex-col">
          <video
            ref={videoRef}
            src={urlMinioVideos + "/" + selectedAd.video_url}
            className={containerClass}
            muted
            autoPlay
            playsInline
            controls={false}
            preload="metadata"
          />
          <div className="w-full flex flex-row justify-between items-start">
            {showClaimButton && (
              <button
                onClick={() => handleClaimInternet(skipAvailable)}
                className="absolute right-10 top-0 bg-white px-4 py-2 rounded-full text-foreground font-semibold shadow-lg cursor-pointer mt-4"
              >
                Klaim Internet
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- default grid
  return (
    <div className="w-full max-w-4xl mx-auto pb-28 lg:pb-32 lg:py-8">
      <div className="flex flex-col justify-center items-center">
        <img src="/captive/logo.svg" alt="logo" className="w-36 object-cover" />
        <div className="flex flex-row items-center gap-3 mt-4">
          <div className="bg-white p-2 rounded-full shadow-lg">
            <FaGift className="w-5 h-5 text-[#939393]" />
          </div>
          <p className="text-gray-800 lg:text-lg sm:text-sm leading-6 mb-0">
            Pilih satu iklan dari sponsor kami dan nikmati internet gratis!
          </p>
        </div>
        <div className="grid grid-cols-2 mt-6 mb-4 gap-2 lg:grid-cols-3">
          {ads &&
            ads.map(function (ad) {
              return (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onSelect={handleAdSelect}
                  urlMinioBanners={urlMinioBanners}
                  urlMinioVideos={urlMinioVideos}
                  urlMinioThumbnails={urlMinioThumbnails}
                />
              );
            })}
        </div>
      </div>

      <div
        className="fixed inset-x-2 bottom-2 max-w-md mx-auto flex flex-col justify-center items-center py-2 px-4 rounded-2xl gap-1 bg-white/75 backdrop-blur-md lg:bottom-4"
        style={{ WebkitBackdropFilter: "blur(12px)" }}
      >
        <p className="text-gray-800 text-xs text-center">Powered by Varnion</p>
      </div>
    </div>
  );
}
