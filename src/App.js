import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./App.scss";

import Video from "./Pages/Video";
import Call from "./Pages/call";

const socket = io.connect("https://video-server-app-1.herokuapp.com/");
function App() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [calling, setCalling] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    setCalling(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    console.log("here");
    setCallEnded(true);
    connectionRef.current.destroy();
  };
  return (
    <React.Fragment>
      <div className="va">
        <div className="va__container">
          <div className="va__container__video">
            <div className="va__container__video__main">
              <Video
                myVideo={myVideo}
                stream={stream}
                callEnded={callEnded}
                callAccepted={callAccepted}
                userVideo={userVideo}
              ></Video>
            </div>
            <div className="va__container__video__control">contols here</div>
          </div>
          <div className="va__container__call">
            <Call
              name={name}
              me={me}
              idToCall={idToCall}
              setIdToCall={setIdToCall}
              setName={setName}
              callUser={callUser}
              calling={calling}
              callEnded={callEnded}
              callAccepted={callAccepted}
              receivingCall={receivingCall}
              callAccepted={callAccepted}
              answerCall={answerCall}
              leaveCall={leaveCall}
            ></Call>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
