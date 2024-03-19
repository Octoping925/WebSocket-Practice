import { CompatClient, Stomp } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

type Chat = { requestUsername: string; message: string };

export function ChatRoom() {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const client = useRef<CompatClient | null>(null);

  function connectHandler() {
    const socket = new SockJS("http://localhost:8080/practice");

    client.current = Stomp.over(socket);
    client.current.connect(getHeader(), () => {
      client.current?.subscribe(
        "/topic/chatting",
        (message) => {
          setChatHistory((prev) => [...prev, JSON.parse(message.body)]);
        },
        getHeader()
      );
    });
  }

  function sendChat() {
    if (!username || !message) return;

    if (client.current && client.current.connected) {
      client.current.send(
        "/app/chat",
        getHeader(),
        JSON.stringify({
          requestUsername: username,
          message: message,
        })
      );
    }

    setMessage("");
  }

  useEffect(() => {
    connectHandler();

    return () => {
      client.current?.disconnect();
    };
  }, []);

  return (
    <>
      <h1>Chat Room</h1>
      <hr />
      <div>
        <h3>채팅 내용</h3>
        <table>
          <tbody>
            {chatHistory.map((chat) => (
              <tr key={chat.message}>
                <td>
                  작성자: {chat.requestUsername} / 메시지: {chat.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr />
      <h3>채팅 보내기</h3>
      <li>
        내 유저네임:{" "}
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </li>
      <li>
        채팅 내용:{" "}
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
      </li>
      <br />
      <button onClick={sendChat}>전송</button>
    </>
  );
}

const getHeader = () => {
  return {
    Authorization: "Bearer " + localStorage.getItem("token"),
    "Content-Type": "application/json",
  };
};
