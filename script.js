let selectedLanguage = null;

// Theme toggle function
document.getElementById('themeToggle').addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('light');
    body.classList.toggle('dark');
});

// Language selection toggle
document.getElementById('languageBtn').addEventListener('click', () => {
    const options = document.getElementById('languageOptions');
    options.style.display = options.style.display === 'block' ? 'none' : 'block';
});

function selectLanguage(language) {
    selectedLanguage = language;
    document.getElementById('languageBtn').innerText = `Language: ${language.toUpperCase()}`;
    document.getElementById('languageOptions').style.display = 'none';
    document.getElementById('sendBtn').disabled = false; // Enable send button after language selection
}

async function translateText() {
    const inputText = document.getElementById("inputText").value.trim();
    
    if (!inputText || !selectedLanguage) {
        alert("Please enter text and select a language!");
        return;
    }

    // Display user's message in chat
    appendMessage(inputText, 'user-message', 'Hindi');

    // Translate the text (mockup error message for now)
    try {
        // This part simulates API error handling for now.
        const errorMessage = `Error: Could not translate to ${selectedLanguage.toUpperCase()}.`; 
        appendMessage(errorMessage, 'bot-message', selectedLanguage.toUpperCase());
    } catch (error) {
        console.error("❌ Translation Error:", error);
        appendMessage('Translation failed!', 'bot-message', selectedLanguage.toUpperCase());
    }
}

function appendMessage(message, className, language) {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.innerHTML = `<strong>${language}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}
