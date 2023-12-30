import SearchBox from "@/components/Header/SearchBox";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import indexVideo from "./indexVideo.mp4";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const suggestSearch = [
    { id: 2330, name: "台積電" },
    { id: 3231, name: "緯創" },
    { id: 2454, name: "聯發科" },
    { id: 3008, name: "大立光" },
    { id: 2308, name: "台達電" },
    { id: 2603, name: "長榮" },
  ];

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.playbackRate = 0.5;
    }
    return () => {
      if (videoElement) {
        videoElement.playbackRate = 1;
      }
    };
  }, []);

  return (
    <div>
      <div className="absolute inset-0 z-30 bg-black/40"></div>

      <video
        ref={videoRef}
        autoPlay
        muted={true}
        loop
        playsInline
        className="absolute z-0 h-[100vh] w-[100vw] object-cover opacity-90"
      >
        <source src={indexVideo} type="video/mp4" />
      </video>

      <div className="flex h-screen items-center">
        <div className="absolute z-30 -mt-32 flex w-full justify-center sm:-mt-60 ">
          <div className="px-5 py-2 font-mono text-lg text-white sm:text-3xl md:text-4xl">
            STOCK.MO 為你開啟一場全新投資旅程
          </div>
        </div>
        <div className="absolute z-40 flex w-full justify-center">
          <SearchBox />
        </div>
        <div className="absolute z-30 mt-32 flex w-full justify-center">
          <div className="rounded-full bg-white/40 px-5 py-2 text-xs  text-white sm:text-base md:text-lg">
            建議搜尋：
            {suggestSearch.map((item, index) => (
              <Link
                to={`stock/${item.id}/latest`}
                key={item.id}
                className="cursor-pointer text-xs md:text-lg"
              >
                {item.name}
                {index !== suggestSearch.length - 1 && "、  "}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
