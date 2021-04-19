import { CopyToClipboard } from "react-copy-to-clipboard";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons";

const Call = ({
  name,
  me,
  idToCall,
  setIdToCall,
  setName,
  callUser,
  callAccepted,
  callEnded,
  leaveCall,
  calling,
  receivingCall,
  answerCall,
}) => {
  console.log(callAccepted, !callEnded);
  return (
    <div className="ca">
      <div className="ca__user p-4 m-4">
        <InputGroup className="mb-3">
          <FormControl
            aria-label="Name"
            value={name}
            id="filled-basic"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
          />
        </InputGroup>
        <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
          <InputGroup className="mb-3">
            <FormControl
              value={me}
              disabled={true}
              style={{ cursor: "context-menu" }}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary">Copy</Button>
            </InputGroup.Append>
          </InputGroup>
        </CopyToClipboard>
      </div>
      <div className="ca__status">
        {callAccepted && !callEnded ? (
          <Button variant="danger" onClick={leaveCall}>
            End Call
          </Button>
        ) : calling && !callEnded ? (
          <div>Calling... &nbsp;{idToCall}</div>
        ) : null}
        {receivingCall && !callAccepted ? (
          <div className="caller">
            <div>{name || "some one"} is Calling</div>
            <Button variant="success" onClick={answerCall}>
              Answer
            </Button>
          </div>
        ) : null}
      </div>
      <div className="ca__call mx-4 ">
        <InputGroup className="mb-3">
          <FormControl
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
            id="filled-basic"
            label="ID to call"
            placeholder="Id to call"
          />
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              onClick={() => callUser(idToCall)}
            >
              <FontAwesomeIcon icon={faPhoneVolume} />
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    </div>
  );
};

export default Call;
