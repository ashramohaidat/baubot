// Get references to the HTML elements we will interact with
const userInput = document.getElementById("userInput");
const chatOutput = document.getElementById("chatOutput");
const sendButton = document.getElementById("sendButton");
const topicButtons = document.getElementsByClassName("topic-button");

// Add an event listener to the send button to handle user input
sendButton.addEventListener("click", debounce(() => {
    const userText = userInput.value.trim();
    if (userText === "") return;

    showOutput(userText, "user");
    const loadingIndicator = showLoadingIndicator();

    setTimeout(() => {
        fetch('sourc/intents.json')
            .then(response => response.json())
            .then(data => {
                const output = getBotResponse(data, userText);
                showOutput(output, "bot", loadingIndicator);
            })
            .catch(error => {
                console.error('Error fetching intents:', error);
                showOutput("Sorry, something went wrong.", "bot", loadingIndicator);
            });
    }, 1000);

    userInput.value = "";
}, 300));

// Add an event listener to the user input field to handle "Enter" key presses
userInput.addEventListener("keydown", debounce((event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        sendButton.click();
    }
}, 300));

// Add event listeners to the topic buttons to handle clicks
for (let i = 0; i < topicButtons.length; i++) {
    topicButtons[i].addEventListener("click", () => {
        const topic = topicButtons[i].textContent;
        showOutput(topic, "user");
        const loadingIndicator = showLoadingIndicator();
        setTimeout(() => {
            fetch('sourc/intents.json')
                .then(response => response.json())
                .then(data => {
                    const output = getBotResponse(data, topic);
                    showOutput(output, "bot", loadingIndicator);
                })
                .catch(error => {
                    console.error('Error fetching intents:', error);
                    showOutput("Sorry, something went wrong.", "bot", loadingIndicator);
                });
        }, 1000);
    });
}

// Function to find information related to the user's input
function getBotResponse(data, userInput) {
    userInput = userInput.toLowerCase();
    for (let intent of data.intents) {
        for (let pattern of intent.patterns) {
            if (userInput.includes(pattern.toLowerCase())) {
                return intent.responses[Math.floor(Math.random() * intent.responses.length)];
            }
        }
    }
    return "I don't understand that. Can you please rephrase?";
}

// Function to show the output in the chat area
function showOutput(text, messageType, loadingIndicator) {
    if (loadingIndicator) {
        removeLoadingIndicator(loadingIndicator);
    }

    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", messageType === "user" ? "user-message" : "bot-message");

    if (messageType === "bot") {
        const avatar = document.createElement("img");
        avatar.src = "imges/bot.png";
        avatar.classList.add("avatar");
        avatar.alt = "Bot Avatar";
        messageElement.appendChild(avatar);
    }

    const messageText = document.createElement("div");
    messageText.innerHTML = text;
    messageElement.appendChild(messageText);

    chatOutput.appendChild(messageElement);
    chatOutput.scrollTo({
        top: chatOutput.scrollHeight,
        behavior: "smooth",
    });
}

// Function to show a loading indicator while the bot is processing
function showLoadingIndicator() {
    const loadingElement = document.createElement("div");
    loadingElement.classList.add("chat-message", "bot-message", "loading-indicator");
    loadingElement.id = "loadingIndicator";

    const avatar = document.createElement("img");
    avatar.src = "imges/bot.png";
    avatar.classList.add("avatar");
    avatar.alt = "Bot Avatar";
    loadingElement.appendChild(avatar);

    const dotFalling = document.createElement("div");
    dotFalling.classList.add("dot-falling");

    for (let i = 1; i <= 4; i++) {
        const dot = document.createElement("div");
        dotFalling.appendChild(dot);
    }

    loadingElement.appendChild(dotFalling);
    chatOutput.appendChild(loadingElement);
    chatOutput.scrollTop = chatOutput.scrollHeight;

    return loadingElement;
}

// Function to remove the loading indicator when the bot has finished processing
function removeLoadingIndicator(loadingIndicator) {
    if (loadingIndicator) {
        chatOutput.removeChild(loadingIndicator);
    }
}

// Debounce function to avoid multiple rapid clicks or key presses
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}
