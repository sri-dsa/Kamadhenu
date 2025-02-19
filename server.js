require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const BHASHINI_API = "https://dhruva-api.bhashini.gov.in/services/inference/web-pipeline";

app.post("/translate", async (req, res) => {
    try {
        const { inputText, sourceLang, targetLang } = req.body;

        const payload = {
            input: [{ source: inputText }],
            config: {
                serviceId: "ai4bharat/indictrans-v2",
                language: { sourceLanguage: sourceLang, targetLanguage: targetLang }
            }
        };

        const response = await axios.post(BHASHINI_API, payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.INFERENCE_API_KEY}`,
                "udyat-api-key": process.env.UDYAT_KEY
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Translation failed" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
