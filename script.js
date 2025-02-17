let selectedLanguage = "";

function toggleTheme() {
    document.body.classList.toggle("dark-theme");
}

function sendMessage() {
    const inputField = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");

    if (inputField.value.trim() === "") return;

    // Append User Message
    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.innerText = `User: ${inputField.value}`;
    chatBox.appendChild(userMessage);

    // Simulate API Response with Error Handling
    setTimeout(() => {
        let responseMessage = document.createElement("div");
        responseMessage.classList.add("bot-message");

        // Simulated API Response
        if (Math.random() > 0.8) {
            responseMessage.innerText = `Error: API failed to respond.`;
        } else {
            responseMessage.innerText = `${selectedLanguage} text: Translated message`;
        }

        chatBox.appendChild(responseMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);

    inputField.value = "";
    document.getElementById("send-btn").disabled = true;
}

function toggleLanguageDropdown() {
    let dropdown = document.getElementById("language-dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function selectLanguage(lang) {
    selectedLanguage = lang;
    document.getElementById("language-btn").innerText = lang;
    document.getElementById("send-btn").disabled = false;
    document.getElementById("language-dropdown").style.display = "none";
}

function checkInput() {
    document.getElementById("send-btn").disabled = document.getElementById("userInput").value.trim() === "";
}
