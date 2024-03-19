package octoping.websocketpractice.chatting

data class ChatDTO(
    val requestUsername: String,
    val message: String,
)