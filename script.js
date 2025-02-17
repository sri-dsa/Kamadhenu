const BHASHINI_HOST = "https://dhruva.bhashini.gov.in";
const TRANSLATION_ENDPOINT = "/services/inference/pipeline";
const INFERENCE_API_KEY = "N8BGXbq4tN3fYZ_57i_XjQbaAut871LQJ4s6hIF1ucupt-yxZp93YiOP8kiImG4V";
const UDYAT_KEY = "28b7ab1439-48e9-43b7-89b4-03793fc945c5";

// Function to toggle between light and dark themes
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('dark-theme');
    
    if (currentTheme) {
        body.classList.remove('dark-theme');
        document.getElementById('theme-toggle').textContent = '💡';
    } else {
        body.classList.add('dark-theme');
        document.getElementById('theme-toggle').textContent = '🌙';
    }
}

// Toggle language options visibility
function toggleLanguageOptions() {
    const languageOptions = document.getElementById('language-options');
    const isVisible = languageOptions.style.display === 'block';
    languageOptions.style.display = isVisible ? 'none' : 'block';
}

// Set selected language and close the language options
function setLanguage(language) {
    document.getElementById("targetLanguage").value = language;
    toggleLanguageOptions(); // Hide the options after selection
}

// Function to send message and get response
async function sendMessage() {
    const inputText = document.getElementById("inputText").value.trim();
    const targetLanguage = document.getElementById("targetLanguage").value;

    if (!inputText) {
        alert("Please enter text to translate!");
        return;
    }

    const chatBox = document.getElementById("chat");
    
    // Add user's message to chat box
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.innerText = inputText;
    chatBox.appendChild(userMessage);

    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;

    const payload = {
        input: [{ source: inputText }],
        config: {
            serviceId: "ai4bharat/indictrans-v2",
            language: {
                sourceLanguage: "hi",
                targetLanguage: targetLanguage
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
            // Add bot's response to chat box
            const botMessage = document.createElement("div");
            botMessage.classList.add("message", "bot-message");
            botMessage.innerText = data.output[0].target;
            chatBox.appendChild(botMessage);
        } else {
            alert("Error: Unexpected API Response!");
        }

        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("🔴 Error:", error);
        alert("Error communicating with the translation service.");
    }

    // Clear the input field
    document.getElementById("inputText").value = "";
}
