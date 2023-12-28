import sender from "./sender";
import utils from "@/utils/utils";

const html = `
    <input id="fabCheckbox" type="checkbox" class="fab-checkbox" />
    <label class="fab" for="fabCheckbox">
        <span class="fab-dots fab-dots-1"></span>
        <span class="fab-dots fab-dots-2"></span>
        <span class="fab-dots fab-dots-3"></span>
    </label>
    <div class="fab-wheel">
        <div class="fab-chat-box">
            <div class="fab-messages">
                <ul id="chat"></ul>
            </div>
            <div class="fab-sender">
                <input type="text" id="input-text" />
                <button id="sender-button">Invia</button>
            </div>
        <div>
    </div>
`;

var threadId = false;
var botId = false;

const injectChat = (botIdInjected) => {
    botId = botIdInjected;
    //if ((await utils.tryBot(botId)).status != "ok") return;

    addCss("./fab.css");
    addCss("./chat.css");

    const newDiv = document.createElement("div");
    newDiv.id = "fabContainer";
    newDiv.className = "fab-wrapper";
    newDiv.innerHTML = html;
    document.body.appendChild(newDiv);

    sender.sendMessage(botId, threadId, "", addMessage);
    document.getElementById("sender-button").addEventListener("click", sendMessageByForm);
};

const addCss = (href) => {
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = href;
    document.head.appendChild(cssLink);
};

const addMessage = (message, bot = true) => {
    const chat = document.getElementById("chat");
    const msg = document.createElement("li");
    msg.className = bot ? "you" : "me";
    msg.innerHTML = `
        <div class="entete"><h2>${bot ? "Bot" : "Utente"}</h2></div>
        <div class="triangle"></div>
        <div class="message">${message}</div>
    `;
    chat.appendChild(msg);
};

const sendMessageByForm = () => {
    const input = document.getElementById("input-text");
    if (input.value != "") {
        addMessage(input.value, false);
        sender.sendMessage(botId, threadId, input.value, addMessage);
        input.value = "";
    }
};

export default {
    injectChat
};
