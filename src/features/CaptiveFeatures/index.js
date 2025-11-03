import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCaptiveAds, viewVideo } from "../../store/action/captiveActions";
import AdCard from "./components/AdCard";
import { resetCaptiveClick } from "../../store/reducers/captiveClickReducer";
import { UAParser } from "ua-parser-js";
import { useHistory, useLocation } from "react-router-dom";
import { fetchUserLogin } from "../../store/action/userLoginActions";
import { postToMikrotikLogin } from "../../utils/mikrotikLogin";

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

  const urlMinioBanners = process.env.REACT_APP_MINIO_BANNERS || "";
  const urlMinioVideos = process.env.REACT_APP_MINIO_VIDEOS || "";
  const urlMinioThumbnails = process.env.REACT_APP_MINIO_THUMBNAILS || "";

  // --- detect device/browser
  const parser = new UAParser();
  const result = parser.getResult();

  const brand = result.device.vendor || (result.os.name === "iOS" ? "Apple" : "Unknown");
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
    if (modalStep !== "video" || !selectedAd || !selectedAd.video_url || !videoRef.current)
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
    return <p>Memuat iklan...</p>;
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
      <div className="banner-container">
        <img
          src={urlMinioBanners + "/" + selectedAd.banner_url}
          alt={selectedAd.title}
          className="banner-image"
        />
        <p>{bannerCounter}</p>
        {isBannerFinished && (
          <button onClick={handleBannerLanjut}>
            {selectedAd.video_url ? "Lanjut" : "Klaim Internet"}
          </button>
        )}
      </div>
    );
  }

  // --- video
  if (modalStep === "video" && selectedAd && selectedAd.video_url) {
    const skipAvailable = selectedAd.skippable && showClaimButton && !videoEnded;
    return (
      <div className="video-container">
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
        {showClaimButton && (
          <button onClick={() => handleClaimInternet(skipAvailable)}>Klaim Internet</button>
        )}
      </div>
    );
  }

  // --- default grid
  return (
    <div className="ads-grid">
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
  );
}
