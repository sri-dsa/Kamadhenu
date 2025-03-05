const BHASHINI_API = "https://dhruva-api.bhashini.gov.in/services/inference/web-pipeline";
const INFERENCE_API_KEY = "7tT86lGiAXxwRvTjvpYjBrtcejxHinFa-6Jb_yQwaJMz1P3NNcYZvQPOXpmPJVEx";
const UDYAT_KEY = "53150dbcde-5d68-4505-a1e5-5299242d6847";

let selectedLanguageCode = "";
let selectedLanguageName = "";

let isRecording = false;
let mediaRecorder;
let audioBlob;
let audioURL;

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const themeButton = document.getElementById('theme-toggle');
    themeButton.textContent = document.body.classList.contains('light-theme') ? "💡" : "🌙";
    themeButton.style.backgroundColor = document.body.classList.contains('light-theme') ? "yellow" : "whitesmoke";
}

function toggleLanguageOptions() {
    const menu = document.getElementById('language-options');
    menu.style.display = menu.classList.toggle('show') ? "block" : "none";
}

function setLanguage(code, name) {
    selectedLanguageCode = code;
    selectedLanguageName = name;
    document.getElementById('language-button').textContent = selectedLanguageName;
    toggleLanguageOptions();
    document.getElementById('inputText').style.display = 'block';  
    document.getElementById('sendButton').disabled = false;
}

function addMessage(text, type, audio = null, image = null) {
    const chatBox = document.getElementById("chat");
    const messageWrapper = document.createElement("div");
    messageWrapper.classList.add("message-wrapper", type);
    
    const label = document.createElement("div");
    label.classList.add("message-label");
    label.textContent = type === "user-message" || type === "bot-message" ? `Text in ${selectedLanguageName}` : "Error: Model connection failed. Please try again.";
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
    
    chatBox.appendChild(messageWrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
}

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
    
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteButton.onclick = () => {
        audioPreviewContainer.style.display = "none";
        audioElement.remove();
    };
    
    audioPreviewContainer.appendChild(audioElement);
    audioPreviewContainer.appendChild(deleteButton);
}

function handleImageSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        displayImagePreview(imageUrl);
    }
}

function displayImagePreview(imageUrl) {
    const inputContainer = document.querySelector(".input-container");
    inputContainer.innerHTML = '';
    
    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.classList.add("image-preview");
    
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteButton.onclick = () => inputContainer.innerHTML = '<textarea id="inputText" rows="3" placeholder="Type here..."></textarea>';
    
    inputContainer.appendChild(imgElement);
    inputContainer.appendChild(deleteButton);
}

async function sendMessage() {
    const inputText = document.getElementById('inputText').value.trim();
    const imageElement = document.querySelector('.input-container img');
    const audioElement = document.querySelector('.input-container audio');
    
    const imageUrl = imageElement ? imageElement.src : null;
    const audioUrl = audioElement ? audioElement.src : null;
    
    if (!inputText && !imageUrl && !audioUrl) return;
    
    addMessage(inputText || "Media message", "user-message", audioUrl, imageUrl);
    document.querySelector(".input-container").innerHTML = '<textarea id="inputText" rows="3" placeholder="Type here..."></textarea>';
    
    if (inputText) {
        const payload = { input: [{ source: inputText }], config: { serviceId: "ai4bharat/indictrans-v2", language: { sourceLanguage: "hi", targetLanguage: selectedLanguageCode } } };
        
        try {
            const response = await fetch(BHASHINI_API, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${INFERENCE_API_KEY}`, "udyat-api-key": UDYAT_KEY }, body: JSON.stringify(payload) });
            const data = await response.json();
            addMessage(data.output?.[0]?.target || "Error: Invalid response", "bot-message", audioUrl, imageUrl);
        } catch (error) {
            addMessage("Error: Model is not linked. Please try again.", "error-message");
        }
    }
}
