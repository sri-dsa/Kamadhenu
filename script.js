const BHASHINI_API = "https://dhruva-api.bhashini.gov.in/services/inference/web-pipeline";
const INFERENCE_API_KEY = "YOUR_API_KEY";
const UDYAT_KEY = "YOUR_UDYAT_KEY";

let selectedLanguageCode = "";
let selectedLanguageName = "";

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    document.getElementById('theme-toggle').textContent = 
        document.body.classList.contains('dark-theme') ? '🌙' : '💡';
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

    // Update the language button text
    document.getElementById('language-button').textContent = selectedLanguageName;
    // Hide the language options
    document.getElementById('language-options').style.display = 'none';

    // Show the input field and enable it
    document.getElementById('inputText').style.display = 'block';  // Make input visible
    document.getElementById('sendButton').disabled = false;  // Enable send button
    document.getElementById('inputText').disabled = false;  // Enable the input text field
}

// Send Message
async function sendMessage() {
    const inputText = document.getElementById('inputText').value.trim();
    if (!inputText) return;

    const chatBox = document.getElementById("chat");
    chatBox.innerHTML += `<div class="message user-message">${inputText}</div>`;

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
        chatBox.innerHTML += `<div class="message bot-message">${selectedLanguageName}: ${data.output[0].target}</div>`;
    } catch (error) {
        chatBox.innerHTML += `<div class="message error-message">Error: Translation failed.</div>`;
    }
}

// Initially hide the input box and the send button
window.onload = () => {
    document.getElementById('inputText').style.display = 'none';  // Hide input initially
    document.getElementById('sendButton').disabled = true;  // Disable send button initially
};
