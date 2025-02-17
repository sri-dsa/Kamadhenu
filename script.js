const BHASHINI_HOST = "https://dhruva.bhashini.gov.in";
const TRANSLATION_ENDPOINT = "/services/inference/pipeline";

// API Keys (⚠️ Keep these secure in production)
const INFERENCE_API_KEY = "N8BGXbq4tN3fYZ_57i_XjQbaAut871LQJ4s6hIF1ucupt-yxZp93YiOP8kiImG4V";
const UDYAT_KEY = "28b7ab1439-48e9-43b7-89b4-03793fc945c5";

async function translateText() {
    const inputText = document.getElementById("inputText").value.trim();
    const targetLanguage = document.getElementById("targetLanguage").value;

    if (!inputText) {
        alert("Please enter text to translate!");
        return;
    }

    const payload = {
        input: [{ source: inputText }],
        config: {
            serviceId: "ai4bharat/indictrans-v2",
            language: {
                sourceLanguage: "hi",  // Hindi as input language
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
        console.log("🔍 API Response:", data);

        if (data.output) {
            document.getElementById("translatedText").innerText = data.output[0].target;
        } else {
            document.getElementById("translatedText").innerText = "Error: Unexpected API Response!";
        }
    } catch (error) {
        console.error("❌ Translation Error:", error);
        document.getElementById("translatedText").innerText = "Translation failed!";
    }
}
