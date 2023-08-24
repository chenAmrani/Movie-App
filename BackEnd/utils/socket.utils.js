const xss = require("xss");

const handleClient = (io) => {
  io.on("connection", (socket) => {
    console.log("New WS Connection...");

    // Listen for incoming chat messages
    socket.on("message", (message) => {
      console.log("message: ", message);

      // Sanitize the message before broadcasting
      const sanitizedMessage = xss.escapeHtml(message);

      // Broadcast the sanitized message to all connected clients
      io.emit("message", sanitizedMessage);
    });

    socket.on("disconnect", () => {
      io.emit("message", "A user has left the chat");
      console.log("User has left the chat");
    });
  });
};
module.exports = { handleClient };
