import os
import openai
import sys
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import DirectoryLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.indexes import VectorstoreIndexCreator
from langchain.indexes.vectorstore import VectorStoreIndexWrapper
from langchain.vectorstores import Chroma
#!/usr/bin/env python
from setuptools import setup, find_packages
from os import path

this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, "README.md"), encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="OpenNMT-py",
    description="A python implementation of OpenNMT",
    long_description=long_description,
    long_description_content_type="text/markdown",
    version="3.5.1",
    packages=find_packages(),
    project_urls={
        "Documentation": "http://opennmt.net/OpenNMT-py/",
        "Forum": "http://forum.opennmt.net/",
        "Gitter": "https://gitter.im/OpenNMT/OpenNMT-py",
        "Source": "https://github.com/OpenNMT/OpenNMT-py/",
    },
    python_requires=">=3.9",
    install_requires=[
        "torch>=2.1,<2.3",
        "configargparse",
        "ctranslate2>=4,<5",
        "tensorboard>=2.3",
        "flask",
        "waitress",
        "pyonmttok>=1.37,<2",
        "pyyaml",
        "sacrebleu",
        "rapidfuzz",
        "pyahocorasick",
        "fasttext-wheel",
        "spacy",
        "six",
    ],
    entry_points={
        "console_scripts": [
            "onmt_server=onmt.bin.server:main",
            "onmt_train=onmt.bin.train:main",
            "onmt_translate=onmt.bin.translate:main",
            "onmt_release_model=onmt.bin.release_model:main",
            "onmt_average_models=onmt.bin.average_models:main",
            "onmt_build_vocab=onmt.bin.build_vocab:main",
        ],
    },
)

os.environ["OPENAI_API_KEY"] = "your_api_key_here"
PERSIST = False

query = sys.argv[1] if len(sys.argv) > 1 else None

if PERSIST and os.path.exists("persist"):
    print("Reusing index...\n")
    vectorstore = Chroma(persist_directory="persist", embedding_function=OpenAIEmbeddings())
    index = VectorStoreIndexWrapper(vectorstore=vectorstore)
else:
    loader = DirectoryLoader("data/")
    index = VectorstoreIndexCreator(vectorstore_kwargs={"persist_directory": "persist"}).from_loaders([loader]) if PERSIST else VectorstoreIndexCreator().from_loaders([loader])

chain = ConversationalRetrievalChain.from_llm(
    llm=ChatOpenAI(model="gpt-3.5-turbo"),
    retriever=index.vectorstore.as_retriever(search_kwargs={"k": 1}),
)

chat_history = []

while True:
    if not query:
        query = input("Prompt (type 'quit' to exit): ")
    if query.lower() in ['quit', 'q', 'exit']:
        print("Exiting the program...")
        sys.exit()
    
    result = chain({"question": query, "chat_history": chat_history})
    
    print("Response:", result['answer'])

    chat_history.append((query, result['answer']))
    query = None 
