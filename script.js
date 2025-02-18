const BHASHINI_API = "https://dhruva-api.bhashini.gov.in/services/inference/web-pipeline";
const INFERENCE_API_KEY = "7tT86lGiAXxwRvTjvpYjBrtcejxHinFa-6Jb_yQwaJMz1P3NNcYZvQPOXpmPJVEx";
const UDYAT_KEY = "53150dbcde-5d68-4505-a1e5-5299242d6847";

let selectedLanguageCode = "";
let selectedLanguageName = "";

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

// Toggle Language Options
function toggleLanguageOptions() {
    document.querySelector('.language-menu').classList.toggle('active');
}

// Set Selected Language
function setLanguage(code, name) {
    selectedLanguageCode = code;
    selectedLanguageName = name;

    document.querySelector('.language-menu').classList.remove('active');
    document.getElementById('inputText').placeholder = `Translate to ${selectedLanguageName}...`;
    document.getElementById('sendButton').disabled = false;
    document.getElementById('sendButton').classList.add('active');
    document.getElementById('inputText').disabled = false;
}

// Send Message
async function sendMessage() {
    const inputText = document.getElementById('inputText').value.trim();
    if (!inputText) return;

    const chatBox = document.getElementById("chat");
    chatBox.innerHTML += `<div class="message user-message" data-label="${selectedLanguageName}">${inputText}</div>`;

    try {
        const response = await fetch(BHASHINI_API, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${INFERENCE_API_KEY}` }});
        const data = await response.json();
        chatBox.innerHTML += `<div class="message bot-message" data-label="Translated ${selectedLanguageName}">${data.output[0].target}</div>`;
    } catch {
        chatBox.innerHTML += `<div class="message error-message" data-label="Error">Translation failed.</div>`;
    }
}
