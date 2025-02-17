const BHASHINI_HOST = "https://dhruva.bhashini.gov.in";
const TRANSLATION_ENDPOINT = "/services/inference/pipeline";
const INFERENCE_API_KEY = "7tT86lGiAXxwRvTjvpYjBrtcejxHinFa-6Jb_yQwaJMz1P3NNcYZvQPOXpmPJVEx";
const UDYAT_KEY = "53150dbcde-5d68-4505-a1e5-5299242d6847";

let selectedLanguage = "";
let selectedLanguageCode = "";

// Function to toggle light/dark themes
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-theme');
    document.getElementById('theme-toggle').style.backgroundColor = isDark ? 'yellow' : 'yellow';
}

// Toggle language options visibility
function toggleLanguageOptions() {
    const languageOptions = document.getElementById('language-options');
    languageOptions.style.display = languageOptions.style.display === 'block' ? 'none' : 'block';
}

// Set the selected language
function setLanguage(languageCode, languageName) {
    selectedLanguageCode = languageCode;
    selectedLanguage = languageName;
    
    document.getElementById('language-button').innerText = languageName;
    document.getElementById('language-options').style.display = 'none';
}

// Function to send message and get translation
async function sendMessage() {
    const inputText = document.getElementById('inputText').value.trim();
    if (!inputText) {
        return;
    }

    // Add user message to chat box (Right-aligned)
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.innerHTML = `<strong>Hindi text:</strong> ${inputText}`;
    document.getElementById("chat").appendChild(userMessage);
    
    // Clear input field
    document.getElementById("inputText").value = "";

    // API Call
    const payload = {
        input: [{ source: inputText }],
        config: {
            serviceId: "ai4bharat/indictrans-v2",
            language: {
                sourceLanguage: "hi",
                targetLanguage: selectedLanguageCode || "ta" // Default Tamil
            }
        }
    };

    try {
        const response = await fetch(BHASHINI_HOST + TRANSLATION_ENDPOINT, {
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
            const botMessage = document.createElement("div");
            botMessage.classList.add("message", "bot-message");
            botMessage.innerHTML = `<strong>${selectedLanguage} text:</strong> ${data.output[0].target}`;
            document.getElementById("chat").appendChild(botMessage);
        } else {
            throw new Error("Invalid API Response");
        }
    } catch (error) {
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("message", "bot-message", "error-message");
        errorMessage.innerHTML = `<strong>${selectedLanguage || "Unknown Language"}:</strong> Error in translation`;
        document.getElementById("chat").appendChild(errorMessage);
    }
}
