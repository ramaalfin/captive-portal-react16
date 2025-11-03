import { useState, useRef, useCallback } from "react";

export function useVideoDuration() {
  const [duration, setDuration] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  return { duration, videoRef, handleLoadedMetadata };
}
