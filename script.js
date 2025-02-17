const BHASHINI_API = "https://dhruva-api.bhashini.gov.in/services/inference/web-pipeline";
const INFERENCE_API_KEY = "7tT86lGiAXxwRvTjvpYjBrtcejxHinFa-6Jb_yQwaJMz1P3NNcYZvQPOXpmPJVEx";
const UDYAT_KEY = "53150dbcde-5d68-4505-a1e5-5299242d6847";

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

    document.getElementById('language-options').style.display = 'none';
    document.getElementById('inputText').placeholder = `Translate to ${selectedLanguageName}...`;
    document.getElementById('sendButton').disabled = false;
    document.getElementById('inputText').disabled = false;
}

// Send Message to Bhashini API
async function sendMessage() {
    const inputText = document.getElementById('inputText').value.trim();
    
    if (!inputText) {
        alert(`Translate to ${selectedLanguageName}: Please enter text to translate!`);
        return;
    }

    // Display user message
    const chatBox = document.getElementById("chat");
    const userMessage = `<div class="message user-message">${inputText}</div>`;
    chatBox.innerHTML += userMessage;
    document.getElementById("inputText").value = "";

    // Translation API Payload
    const payload = {
        input: [{ source: inputText }],
        config: {
            serviceId: "ai4bharat/indictrans-v2",
            language: {
                sourceLanguage: "en",
                targetLanguage: selectedLanguageCode
            }
        }
    };

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

        if (data.output) {
            const botMessage = `<div class="message bot-message">${data.output[0].target}</div>`;
            chatBox.innerHTML += botMessage;
        } else {
            alert(`Translate to ${selectedLanguageName}: Translation failed.`);
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Error:", error);
        alert(`Translate to ${selectedLanguageName}: Error contacting translation service.`);
    }
}
