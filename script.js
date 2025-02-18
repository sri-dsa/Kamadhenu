const BHASHINI_API = "https://dhruva-api.bhashini.gov.in/services/inference/web-pipeline";
const INFERENCE_API_KEY = "YOUR_API_KEY";
const UDYAT_KEY = "YOUR_UDYAT_KEY";

let selectedLanguageCode = "";
let selectedLanguageName = "";

// Set Dark Theme as Default
document.body.classList.add('dark-theme');
document.getElementById('theme-toggle').textContent = '🌙';

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    document.getElementById('theme-toggle').textContent =
        document.body.classList.contains('dark-theme') ? '🌙' : '💡';
    updateMessageTextColors(); // Update message colors based on theme
}

// Toggle Language Options
function toggleLanguageOptions() {
    const menu = document.getElementById('language-options');
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// Set Selected Language
function setLanguage(code, name) {
    selectedLanguageCode = code;
    selectedLanguageName = name;

    document.getElementById('language-button').textContent = selectedLanguageName;
    document.getElementById('language-options').style.display = 'none';
    document.getElementById('sendButton').disabled = false;
    document.getElementById('inputText').disabled = false;
    document.getElementById('inputText').focus();
}

// Send Message
async function sendMessage() {
    const inputText = document.getElementById('inputText').value.trim();
    if (!inputText) return;

    const chatBox = document.getElementById("chat");
    chatBox.innerHTML += `<div class="message user-message">${inputText}</div>`;
    
    // Store previous chat messages
    const messageHistory = {
        user: inputText
    };

    const payload = {
        input: [{ source: inputText }],
        config: { serviceId: "ai4bharat/indictrans-v2", language: { sourceLanguage: "en", targetLanguage: selectedLanguageCode }}
    };

    try {
        const response = await fetch(BHASHINI_API, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${INFERENCE_API_KEY}`, "udyat-api-key": UDYAT_KEY },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        const translatedText = data.output[0].target;
        
        // Display translated response
        chatBox.innerHTML += `<div class="message bot-message">${selectedLanguageName}: ${translatedText}</div>`;
        messageHistory.response = translatedText;

        // Save message history (user message and translated response)
        saveMessageHistory(messageHistory);
    } catch (error) {
        chatBox.innerHTML += `<div class="message error-message">Error: Translation failed.</div>`;
    }
}

// Save message history to chat history
function saveMessageHistory(history) {
    // You can implement localStorage or sessionStorage here if needed for persistence
    console.log("Saving message history", history);
}

// Update message text colors based on theme
function updateMessageTextColors() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(msg => {
        if (document.body.classList.contains('dark-theme')) {
            msg.style.color = '#fff';  // White for dark theme
        } else {
            msg.style.color = '#000';  // Black for light theme
        }
    });
}

// Adjust theme toggle button position based on screen width
window.addEventListener('resize', function () {
    const themeToggleButton = document.getElementById('theme-toggle');
    if (window.innerWidth <= 768) {
        themeToggleButton.style.position = 'absolute';
        themeToggleButton.style.left = '50%';
        themeToggleButton.style.transform = 'translateX(-50%)';
    } else {
        themeToggleButton.style.position = 'static';
    }
});

// Initialize responsive layout for theme toggle button
window.dispatchEvent(new Event('resize'));
