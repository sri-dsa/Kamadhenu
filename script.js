const ULCA_API_URL = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline";
const UDYAT_KEY = "53150dbcde-5d68-4505-a1e5-5299242d6847";
const USER_ID = "srivathsan22032001@gmail.com";

let selectedLanguageCode = "";
let selectedLanguageName = "";

// Theme Toggle Function
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const themeButton = document.getElementById('theme-toggle');
    themeButton.textContent = document.body.classList.contains('light-theme') ? "💡" : "🌙";
}

// Toggle Language Dropdown
function toggleLanguageOptions() {
    const menu = document.getElementById('language-options');
    if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        setTimeout(() => (menu.style.display = "none"), 300);
    } else {
        menu.style.display = "block";
        setTimeout(() => menu.classList.add('show'), 10);
    }
}

// Set Selected Language
function setLanguage(code, name) {
    selectedLanguageCode = code;
    selectedLanguageName = name;

    document.getElementById('language-button').textContent = selectedLanguageName;
    toggleLanguageOptions();

    document.getElementById('inputText').style.display = 'block';
    document.getElementById('sendButton').disabled = false;
    document.getElementById('inputText').disabled = false;
}

// Function to add a message to chat
function addMessage(text, type) {
    const chatBox = document.getElementById("chat");

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);

    const label = document.createElement("div");
    label.classList.add("message-label");

    if (type === "user-message") {
        label.textContent = `User: "${selectedLanguageName}"`;
        messageDiv.style.alignSelf = "flex-end";
    } else if (type === "bot-message") {
        label.textContent = `Response (${selectedLanguageName})`;
        messageDiv.style.alignSelf = "flex-start";
    } else if (type === "error-message") {
        label.textContent = "Error";
        messageDiv.style.backgroundColor = "red";
    }

    messageDiv.textContent = text;
    chatBox.appendChild(label);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send Message Function (Transliteration API Call)
async function sendMessage() {
    const inputText = document.getElementById('inputText').value.trim();
    if (!inputText) return;

    addMessage(inputText, "user-message");

    const payload = {
        pipelineTasks: [
            {
                taskType: "transliteration",
                config: {
                    language: { sourceLanguage: "en", targetLanguage: selectedLanguageCode }
                }
            }
        ],
        pipelineRequestConfig: { pipelineId: "64392f96daac500b55c543cd" }
    };

    try {
        const response = await fetch(ULCA_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ulcaApiKey": UDYAT_KEY,
                "userID": USER_ID
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.output && data.output[0]) {
            addMessage(data.output[0], "bot-message");
        } else {
            throw new Error("Invalid response from API");
        }
    } catch (error) {
        addMessage("Transliteration failed. Please try again.", "error-message");
    }
}

// Initialize UI on Load
window.onload = () => {
    document.getElementById('inputText').style.display = 'none';
    document.getElementById('sendButton').disabled = true;
};
