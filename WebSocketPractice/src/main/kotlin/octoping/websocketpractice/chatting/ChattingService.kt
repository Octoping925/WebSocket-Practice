package octoping.websocketpractice.chatting

import org.springframework.stereotype.Service

@Service
class ChattingService {
    fun chat(requestUsername: String, message: String): Chat {
        // 대충 저장하는 로직

        return Chat(
            requestUsername = requestUsername,
            message = message
        )
    }
}