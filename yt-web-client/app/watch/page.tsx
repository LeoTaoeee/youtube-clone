"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VideoPlayer() {
  const searchParams = useSearchParams();
  const videoSrc = searchParams.get("v");
  const videoPrefix = 'https://storage.googleapis.com/dleo-yt-processed-videos/';

  return <video controls src={videoPrefix + videoSrc} />;
}

export default function Watch() {
  return (
    <div>
      <h1>Watch Page</h1>
      <Suspense fallback={<div>Loading video...</div>}>
        <VideoPlayer />
      </Suspense>
    </div>
  );
}