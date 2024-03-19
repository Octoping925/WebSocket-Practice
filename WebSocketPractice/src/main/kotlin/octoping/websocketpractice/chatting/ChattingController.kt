package octoping.websocketpractice.chatting

import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller

@Controller
class ChattingController(
    private val chattingService: ChattingService,
) {
    @MessageMapping("/chat")
    @SendTo("/topic/chatting")
    fun chatting(request: ChatRequestDTO): ChatDTO {
        chattingService.chat(request.requestUsername, request.message)

        return ChatDTO(
            requestUsername = request.requestUsername,
            message = request.message
        )
    }
}