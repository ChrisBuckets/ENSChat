import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import { ethers } from "ethers";
import Chat from "./Chat";

const socket = io.connect("https://api.enschat.xyz:443", { secure: true });

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showConnect, setShowConnect] = useState(true);
  const [showJoin, setShowJoin] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const connectWallet = () => {
    if (!window.ethereum) {
      return setErrorMessage("You must have Metamask installed to connect wallet.");
    }

    window.ethereum.request({ method: "eth_requestAccounts" }).then(async (result) => {
      const address = result[0];
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const ens = await provider.lookupAddress(address);
      if (ens !== null) {
        setUsername(ens);
        setRoom("main");

        setShowJoin(true);
        setDefaultAccount(ens);
        setShowConnect(false);
        setShowChat(false);
        setErrorMessage("");
      }

      if (!ens) {
        setShowJoin(false);
        setShowConnect(false);
        setShowChat(false);
        setUsername("");
        setDefaultAccount("No ENS :(");
        setErrorMessage("No ENS domain found for this address.");
      }
    });
  };

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  if (window.ethereum) window.ethereum.on("accountsChanged", connectWallet);

  return (
    <div className="App">
      <div className="container">
        <span className="box">
          <h2>ENS Chat</h2>
        </span>
      </div>
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>{defaultAccount}</h3>

          <h4 className="errorMessage">{errorMessage}</h4>
          {showConnect && <button onClick={connectWallet}>Connect Wallet</button>}
          {showJoin && <button onClick={joinRoom}>Join Chat</button>}
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}
export default App;
