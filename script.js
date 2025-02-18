// Ensure Dark Theme is Default on Page Load
document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("dark-theme");
});

// WhatsApp-Style Language Unfold
function toggleLanguageOptions() {
    document.querySelector('.language-menu').classList.toggle('active');
}

// Apply Selected Language
function setLanguage(code, name) {
    selectedLanguageCode = code;
    selectedLanguageName = name;

    document.querySelector('.language-menu').classList.remove('active');
    document.getElementById('inputText').placeholder = `Translate to ${selectedLanguageName}...`;
    document.getElementById('sendButton').disabled = false;
    document.getElementById('sendButton').classList.add('active');
    document.getElementById('inputText').disabled = false;
}

// Send Message (Keeps Your API Integration)
async function sendMessage() {
    const inputText = document.getElementById('inputText').value.trim();
    if (!inputText) return;

    const chatBox = document.getElementById("chat");
    chatBox.innerHTML += `<div class="message user-message" data-label="${selectedLanguageName}">${inputText}</div>`;

    try {
        const response = await fetch(BHASHINI_API, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${INFERENCE_API_KEY}` }
        });
        const data = await response.json();

        chatBox.innerHTML += `<div class="message bot-message" data-label="Translated ${selectedLanguageName}">${data.output[0].target}</div>`;
    } catch {
        chatBox.innerHTML += `<div class="message error-message" data-label="Error">Translation failed.</div>`;
    }
}
