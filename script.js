

console.log("hello");

async function sendMessage() {
  const input = document.getElementById("input-chat");
  const result = document.getElementById("result");
  const inputText = input.value.trim();

  if (!inputText) {
    result.textContent = "Please type something first!";
    return;
  }

  result.textContent = "Loading...";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: inputText }),
    });

    const data = await res.json();
    if (data.reply) {
      result.textContent = data.reply;
    } else {
      result.textContent = "No reply from server.";
    }

    input.value = "";
  } catch (err) {
    console.error(err);
    result.textContent = "Error connecting to server.";
  }
}

document.getElementById("send").addEventListener("click", sendMessage);
document.getElementById("input-chat").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
