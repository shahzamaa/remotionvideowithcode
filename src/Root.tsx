import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { TradingVideo } from "./TradingVideo";
import { PromotionVideo } from "./PromotionVideo";
import { AdvancedReel } from "./AdvancedReel";
import { LifeChangeReel } from "./LifeChangeReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LifeChangeReel"
        component={LifeChangeReel}
        durationInFrames={750} // 25 seconds
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AdvancedReel"
        component={AdvancedReel}
        durationInFrames={540} // 18 seconds
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="PromotionVideo"
        component={PromotionVideo}
        durationInFrames={660} // 22 seconds @ 30fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="TradingShort"
        component={TradingVideo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
