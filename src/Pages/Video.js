import { useState } from "react";

const Video = ({ myVideo, stream, callAccepted, callEnded, userVideo }) => {
  return (
    <div>
      {stream && (
        <video
          playsInline
          muted
          ref={myVideo}
          autoPlay
          style={{ width: "300px" }}
        />
      )}
      {callAccepted && !callEnded ? (
        <video
          playsInline
          ref={userVideo}
          autoPlay
          style={{ width: "300px" }}
        />
      ) : null}
    </div>
  );
};

export default Video;
