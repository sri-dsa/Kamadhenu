const BHASHINI_HOST = "https://dhruva.bhashini.gov.in";
const TRANSLATION_ENDPOINT = "/services/inference/pipeline";
const INFERENCE_API_KEY = "N8BGXbq4tN3fYZ_57i_XjQbaAut871LQJ4s6hIF1ucupt-yxZp93YiOP8kiImG4V";
const UDYAT_KEY = "28b7ab1439-48e9-43b7-89b4-03793fc945c5";

let selectedLanguage = 'ta'; // Default language is Tamil
let chatHistory = []; // To store chat history

// Toggle theme between light and dark
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark');
    body.classList.toggle('light');
}

// Toggle language options list
function toggleLanguageList() {
    const languageOptions = document.getElementById('language-options');
    languageOptions.style.display = languageOptions.style.display === 'block' ? 'none' : 'block';
}

// Set selected language
function setLanguage(languageCode) {
    selectedLanguage = languageCode;
    document.getElementById('language-options').style.display = 'none';
    document.getElementById('languageBtn').innerText = `Language: ${languageCode}`;
}

// Send message and get translation
async function sendMessage() {
    const inputText = document.getElementById('inputText').value.trim();
    if (!inputText) {
        alert("Please enter text to translate!");
        return;
    }

    // Add user message to chat history
    chatHistory.push({ user: inputText, translated: '' });

    // Add user message to chat box
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.innerText = `Hindi: ${inputText}`;
    document.getElementById("chat").appendChild(userMessage);

    // Clear input field
    document.getElementById("inputText").value = "";

    // Scroll to the bottom of the chat box
    const chatBox = document.getElementById("chat");
    chatBox.scrollTop = chatBox.scrollHeight;

    // Call translation API
    const payload = {
        input: [{ source: inputText }],
        config: {
            serviceId: "ai4bharat/indictrans-v2",
            language: {
                sourceLanguage: "hi", // Assuming Hindi as the source language
                targetLanguage: selectedLanguage
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
            // Add translated message to chat history
            chatHistory[chatHistory.length - 1].translated = data.output[0].target;

            const botMessage = document.createElement("div");
            botMessage.classList.add("message", "bot-message");
            botMessage.innerText = `${selectedLanguage}: ${data.output[0].target}`;
            document.getElementById("chat").appendChild(botMessage);
        } else {
            const errorMessage = document.createElement("div");
            errorMessage.classList.add("message", "bot-message");
            errorMessage.innerText = "Error: Unexpected API Response!";
            document.getElementById("chat").appendChild(errorMessage);
        }

        // Scroll to the bottom of the chat box
        document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
    } catch (error) {
        console.error("🔴 Error:", error);
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("message", "bot-message");
        errorMessage.innerText = "Error communicating with the translation service.";
        document.getElementById("chat").appendChild(errorMessage);
    }
}
