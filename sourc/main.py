import json
import random
import nltk

#Downloaded NLTK
nltk.download("punkt")

def load_intents(file_path):
    with open("sourc\intents.json", "r") as file:
        return json.load(file)["intents"]

def get_response(user_input, intents):
    user_input = user_input.lower()
    for intent in intents:
        if user_input in intent["patterns"]:
            return random.choice(intent["responses"])
    return random.choice(["Sorry, I didn't understand that.", "Could you please rephrase that?"])

def tokenize_words(text):
    return nltk.word_tokenize(text)

def main():
    intents = load_intents("intents.json")
    print("Chatbot: Hello! How can I assist you today?")
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'exit':
            print("Chatbot: Goodbye! Have a great day!")
            break

        # Tokenize user input into words
        tokens = tokenize_words(user_input)
        #print("Chatbot: Tokenized input:", tokens)

        response = get_response(user_input, intents)
        print("Chatbot:", response)

if __name__ == "__main__":
    main()

