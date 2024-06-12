import { CompatClient, Stomp } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

type Chat = {
  id: number;
  message: string;
  member: {
    id: number;
    nickname: string;
    baekjoonTier: string | null;
  };
  createdAt: string;
};

export function ChatRoom({ roomId }: { roomId: number }) {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const client = useRef<CompatClient | null>(null);

  function connectHandler() {
    const socket = new SockJS("http://localhost:8080/ws-chat");

    client.current = Stomp.over(socket);
    client.current.connect(undefined, () => {
      client.current?.subscribe(`/chat/${roomId}`, (message) => {
        // 구독해둔 채팅방에서 채팅이 올라왔을 경우
        setChatHistory((prev) => [...prev, JSON.parse(message.body)]);
      });
    });
  }

  function sendChat() {
    if (client.current && client.current.connected) {
      client.current.send(
        `/app/${roomId}`,
        undefined,
        JSON.stringify({
          requestMemberId: Number(username),
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
  }, [roomId]);

  useEffect(() => {
    setChatHistory([]);
    fetch(`http://localhost:8080/chats/${roomId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setChatHistory(data.chat);
      });
  }, [roomId]);

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
                  작성자: {chat.member.nickname} / 메시지: {chat.message}
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
