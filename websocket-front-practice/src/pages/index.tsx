import { ChatRoom } from "@/component/ChatRoom";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState<number>(2);

  return (
    <div>
      <input
        defaultValue={2}
        onChange={(e) => setRoomId(Number(e.target.value))}
      />
      <ChatRoom roomId={roomId} />
    </div>
  );
}
