import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

# Set up Bhashini API URL and authorization headers
BHASHINI_API = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
INFERENCE_API_KEY = "7tT86lGiAXxwRvTjvpYjBrtcejxHinFa-6Jb_yQwaJMz1P3NNcYZvQPOXpmPJVEx"
UDYAT_KEY = "53150dbcde-5d68-4505-a1e5-5299242d6847"

@app.route('/translate', methods=['POST'])
def translate():
    try:
        # Get input data from the request
        input_data = request.get_json()

        source_text = input_data.get('text')  # Text to be translated
        source_lang = input_data.get('source_language')  # Source language code (e.g., 'hi', 'ta')
        
        if not source_text or not source_lang:
            return jsonify({'error': 'Missing required parameters'}), 400

        # Prepare the API payload
        payload = {
            "pipelineTasks": [
                {
                    "taskType": "translation",
                    "config": {
                        "language": {
                            "sourceLanguage": source_lang,
                            "targetLanguage": "en"  # Always translate to English
                        },
                        "serviceId": ""
                    }
                }
            ],
            "inputData": {
                "input": [{"source": source_text}]
            }
        }

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {INFERENCE_API_KEY}',
            'udyat-api-key': UDYAT_KEY
        }

        # Send the request to the Bhashini API
        response = requests.post(BHASHINI_API, json=payload, headers=headers)
        data = response.json()

        # Check if the translation was successful
        if data.get('output') and data['output'][0].get('target'):
            translated_text = data['output'][0]['target']
            return jsonify({'translated_text': translated_text})

        else:
            return jsonify({'error': 'Translation failed'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
