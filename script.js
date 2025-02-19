const BHASHINI_API = "https://dhruva-api.bhashini.gov.in/services/inference/web-pipeline";
const INFERENCE_API_KEY = "7tT86lGiAXxwRvTjvpYjBrtcejxHinFa-6Jb_yQwaJMz1P3NNcYZvQPOXpmPJVEx";
const UDYAT_KEY = "53150dbcde-5d68-4505-a1e5-5299242d6847";

let selectedLanguageCode = "";
let selectedLanguageName = "";

// Theme Toggle Function
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const themeButton = document.getElementById('theme-toggle');

    if (document.body.classList.contains('light-theme')) {
        themeButton.textContent = "💡";
        themeButton.style.backgroundColor = "yellow"// Light mode icon
    } else {
        themeButton.textContent = "🌙";
        themeButton.style.backgroundColor = "whitesmoke"// Dark mode icon
    }
}

// Toggle Language Dropdown (WhatsApp-style)
function toggleLanguageOptions() {
    const menu = document.getElementById('language-options');
    if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        setTimeout(() => (menu.style.display = "none"), 300);  // Smooth fade-out
    } else {
        menu.style.display = "block";
        setTimeout(() => menu.classList.add('show'), 10);  // Smooth fade-in
    }
}

// Set Selected Language
function setLanguage(code, name) {
    selectedLanguageCode = code;
    selectedLanguageName = name;

    // Update the language button text
    document.getElementById('language-button').textContent = selectedLanguageName;
    // Hide the dropdown smoothly
    toggleLanguageOptions();

    // Show the input field and enable it
    document.getElementById('inputText').style.display = 'block';  
    document.getElementById('sendButton').disabled = false;  
    document.getElementById('inputText').disabled = false;  
}

// Function to add a message to chat
function addMessage(text, type) {
    const chatBox = document.getElementById("chat");

    // Create message wrapper
    const messageWrapper = document.createElement("div");
    messageWrapper.classList.add("message-wrapper", type);

    // Create label
    const label = document.createElement("div");
    label.classList.add("message-label");

    if (type === "user-message") {
        label.textContent = "Text in Hindi"; // Static for user messages
        messageWrapper.style.alignSelf = "flex-end"; // Align to right
    } else if (type === "bot-message") {
        label.textContent = `Text in ${selectedLanguageName}`; // Dynamic for bot messages
        messageWrapper.style.alignSelf = "flex-start"; // Align to left
    }

    // Create message bubble
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);
    messageDiv.textContent = text;

    // Attach label above message bubble
    messageWrapper.appendChild(label);
    messageWrapper.appendChild(messageDiv);
    chatBox.appendChild(messageWrapper);

    // Auto-scroll to latest message
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send Message Function
async function sendMessage() {
    const inputText = document.getElementById('inputText').value.trim();
    if (!inputText) return;

    // Show user's message
    addMessage(inputText, "user-message");

    // Prepare API payload
    const payload = {
        input: [{ source: inputText }],
        config: {
            serviceId: "ai4bharat/indictrans-v2",
            language: { sourceLanguage: "hi", targetLanguage: selectedLanguageCode }
        }
    };

    // Clear the input field after sending the message
    document.getElementById('inputText').value = '';

    try {
        const response = await fetch(BHASHINI_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${INFERENCE_API_KEY}`,
                "udyat-api-key": UDYAT_KEY
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.output && data.output[0] && data.output[0].target) {
            addMessage(data.output[0].target, "bot-message");
        } else {
            throw new Error("Invalid response from API");
        }
    } catch (error) {
        addMessage("Error: Translation failed. Please try again.", "bot-message"); // Error inside bot response
    }
}

// Initialize UI on Load
window.onload = () => {
    document.getElementById('inputText').style.display = 'none';  // Hide input initially
    document.getElementById('sendButton').disabled = true;  // Disable send button initially

    const inputField = document.getElementById("inputText");

    // Check if input field exists before adding event listener
    if (inputField) {
        inputField.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevents new lines in the input field
                sendMessage(); // Calls the sendMessage function
            }
        });
    }
};
