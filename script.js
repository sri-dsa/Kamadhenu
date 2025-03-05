const BHASHINI_API = "https://dhruva-api.bhashini.gov.in/services/inference/web-pipeline";
const INFERENCE_API_KEY = "7tT86lGiAXxwRvTjvpYjBrtcejxHinFa-6Jb_yQwaJMz1P3NNcYZvQPOXpmPJVEx";
const UDYAT_KEY = "53150dbcde-5d68-4505-a1e5-5299242d6847";

let selectedLanguageCode = "";
let selectedLanguageName = "";

let isRecording = false;
let mediaRecorder;
let audioBlob;
let audioURL;

// Theme Toggle Function
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const themeButton = document.getElementById('theme-toggle');

    if (document.body.classList.contains('light-theme')) {
        themeButton.textContent = "💡";
        themeButton.style.backgroundColor = "yellow";
    } else {
        themeButton.textContent = "🌙";
        themeButton.style.backgroundColor = "whitesmoke";
    }
}

// Toggle Language Dropdown (WhatsApp-style)
function toggleLanguageOptions() {
    const menu = document.getElementById('language-options');
    if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        setTimeout(() => (menu.style.display = "none"), 300);
    } else {
        menu.style.display = "block";
        setTimeout(() => menu.classList.add('show'), 10);
    }
}

// Set Selected Language
function setLanguage(code, name) {
    selectedLanguageCode = code;
    selectedLanguageName = name;
    document.getElementById('language-button').textContent = selectedLanguageName;
    toggleLanguageOptions();
    document.getElementById('inputText').style.display = 'block';  
    document.getElementById('sendButton').disabled = false;  
    document.getElementById('inputText').disabled = false;  
}

// Function to add a message to chat
function addMessage(text, type, audio = null, image = null) {
    const chatBox = document.getElementById("chat");
    const messageWrapper = document.createElement("div");
    messageWrapper.classList.add("message-wrapper", type);

    const label = document.createElement("div");
    label.classList.add("message-label");
    label.textContent = type === "user-message" ? `Text in ${selectedLanguageName}` : "Bot Response";
    messageWrapper.appendChild(label);

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", type);
    messageDiv.textContent = text;
    messageWrapper.appendChild(messageDiv);

    if (audio) {
        const audioElement = document.createElement("audio");
        audioElement.controls = true;
        audioElement.src = audio;
        messageWrapper.appendChild(audioElement);
    }

    if (image) {
        const imgElement = document.createElement("img");
        imgElement.src = image;
        imgElement.classList.add("image-preview");
        messageWrapper.appendChild(imgElement);
    }

    if (type === "bot-message") {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        const audioButton = document.createElement("button");
        audioButton.textContent = "🔊";
        audioButton.onclick = () => playAudio(text, selectedLanguageCode);
        buttonContainer.appendChild(audioButton);

        const imageButton = document.createElement("button");
        imageButton.textContent = "🖼️";
        imageButton.onclick = () => openImageInput();
        buttonContainer.appendChild(imageButton);

        messageWrapper.appendChild(buttonContainer);
    }

    chatBox.appendChild(messageWrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Play Audio Function
function playAudio(text, languageCode) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageCode || "en";
    speechSynthesis.speak(utterance);
}

function toggleRecording() {
    const inputField = document.getElementById('inputText');
    const audioPreviewContainer = document.getElementById('audioPreview');
    if (isRecording) {
        mediaRecorder.stop();
        inputField.disabled = false;
        audioPreviewContainer.style.display = "none";
    } else {
        startRecording();
        inputField.disabled = true;
        audioPreviewContainer.style.display = "block";
    }
    isRecording = !isRecording;
}

async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];
    mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
    mediaRecorder.onstop = () => {
        audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioURL = URL.createObjectURL(audioBlob);
        displayAudioPreview(audioURL);
    };
    mediaRecorder.start();
}

function displayAudioPreview(audioURL) {
    const audioPreviewContainer = document.getElementById('audioPreview');
    audioPreviewContainer.innerHTML = '';
    const audioElement = document.createElement("audio");
    audioElement.controls = true;
    audioElement.src = audioURL;
    audioPreviewContainer.appendChild(audioElement);
    audioPreviewContainer.style.display = "block";
}

async function sendMessage() {
    const inputText = document.getElementById('inputText').value.trim();
    if (!inputText) return;
    addMessage(inputText, "user-message");

    const payload = {
        input: [{ source: inputText }],
        config: {
            serviceId: "ai4bharat/indictrans-v2",
            language: { sourceLanguage: "hi", targetLanguage: selectedLanguageCode }
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
        if (data.output && data.output[0] && data.output[0].target) {
            addMessage(data.output[0].target, "bot-message");
        } else {
            throw new Error("Invalid response from API");
        }
    } catch (error) {
        addMessage("Error: Model is not linked. Please try again.", "error-message");
    }
}

window.onload = () => {
    document.getElementById('inputText').style.display = 'none';
    document.getElementById('sendButton').disabled = true;
};
