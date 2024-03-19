package octoping.websocketpractice.chatting

data class ChatRequestDTO(
    val requestUsername: String,
    val message: String,
)
