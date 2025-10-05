const socket = io({
  path: '/chat/socket.io/'
});

socket.on('connect', () => {
  console.log('[i] CONNECTED TO CHAT.');
});

socket.on('disconnect', () => {
  console.log('[i] DISCONNECTED FROM CHAT.');
});

socket.on('connect_error', (error) => {
  console.log('[i] CONNECTION ERROR:', error);
});

let currentUsername = "";
let lastMessageUser = "";
let messageGroups = [];
let lastMessageTime = 0;
let userCount = 0;
let currentChat = "main";
let dmChats = new Map();
let mainChatHistory = [];
let unreadCounts = new Map();
let savedCredentials = null;
let mainChatPings = 0;
let onlineUsers = [];
let loginStep = 'username';
let audioContext = null;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

const appContainer = document.querySelector(".app-container");
const sidebar = document.getElementById("sidebar");
const mainChatBtn = document.getElementById("main-chat-btn");
const createDmBtn = document.getElementById("create-dm-btn");
const dmList = document.getElementById("dm-list");
const usernameSetup = document.getElementById("username-setup");
const chatInterface = document.getElementById("chat-interface");
const usernameInput = document.getElementById("username-input");
const usernameBtn = document.getElementById("username-btn");
const usernameError = document.getElementById("username-error");
const chatTitle = document.getElementById("chat-title");
const currentUserElement = document.getElementById("current-user");
const messagesContainer = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const messageError = document.getElementById("message-error");
const passwordInput = document.getElementById("password-input");

loadCreds();

function loadCreds() {
  try {
    const saved = localStorage.getItem("pine_chat_credentials");
    if (saved) {
      savedCredentials = JSON.parse(saved);
      usernameInput.value = savedCredentials.username;
    }
  } catch (error) {
    console.log("No saved credentials found");
  }
}

function saveCreds(username, password) {
  try {
    localStorage.setItem(
      "pine_chat_credentials",
      JSON.stringify({
        username: username,
        password: password,
      }),
    );
  } catch (error) {
    console.log("Could not save credentials");
  }
}

function loadDmChats() {
  try {
    const saved = localStorage.getItem("pine_directmsgs");
    if (saved) {
      const parsed = JSON.parse(saved);
      dmChats = new Map(Object.entries(parsed));
      updateDmList();
    }
  } catch (error) {
    console.log("Could not load DM chats");
  }
}

function saveDmChats() {
  try {
    const obj = Object.fromEntries(dmChats);
    localStorage.setItem("pine_directmsgs", JSON.stringify(obj));
  } catch (error) {
    console.log("Could not save DM chats");
  }
}

usernameBtn.addEventListener("click", async () => {
  if (loginStep === 'username') {
    const username = usernameInput.value.trim();
    if (!username) return;

    if (savedCredentials && savedCredentials.username === username) {
      usernameBtn.disabled = true;
      socket.emit("set-username", {username, password: savedCredentials.password});
    } else {
      loginStep = 'password';
      usernameInput.style.display = 'none';
      passwordInput.style.display = 'block';
      passwordInput.focus();
      usernameBtn.textContent = 'Login';
    }
  } else if (loginStep === 'password') {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!password) return;

    usernameBtn.disabled = true;
    socket.emit("set-username", {username, password});
  }
});

usernameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    usernameBtn.click();
  }
});

passwordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    usernameBtn.click();
  }
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();

  if (message && canSendMessage()) {
    sendBtn.disabled = true;

    if (currentChat === "main") {
      socket.emit("chat-message", message);
    } else {
      socket.emit("dm-message", {
        targetUsername: currentChat,
        message: message,
      });
    }

    messageInput.value = "";
    lastMessageTime = Date.now();

    setTimeout(() => {
      sendBtn.disabled = false;
    }, 1500);
  }
});

function canSendMessage() {
  const now = Date.now();
  return now - lastMessageTime >= 1500;
}

function showError(type, message) {
  const errorElement = type === "username" ? usernameError : messageError;
  errorElement.textContent = message;
  errorElement.style.opacity = "1";
  setTimeout(() => {
    errorElement.style.opacity = "0";
  }, 3000);
}

function clearError(type) {
  const errorElement = type === "username" ? usernameError : messageError;
  errorElement.style.opacity = "0";
}

socket.on("username-accepted", (username) => {
  currentUsername = username;
  currentUserElement.textContent = username;

  const password = passwordInput.value || savedCredentials?.password;
  if (password) {
    saveCreds(username, password);
  }

  initAudio();

  usernameSetup.classList.add("hidden");
  chatInterface.classList.remove("hidden");
  sidebar.classList.remove("hidden");
  messageInput.focus();
  clearError("username");

  loadDmChats();
  mainChatHistory = [];
  socket.emit("get-online-users");
  updateOnlineCount();
});

socket.on("username-error", (error) => {
  showError("username", error);
  usernameBtn.disabled = false;

  if (loginStep === 'password') {
    loginStep = 'username';
    usernameInput.style.display = 'block';
    passwordInput.style.display = 'none';
    passwordInput.value = '';
    usernameBtn.textContent = 'Login';
  }
});

socket.on("chat-message", (data) => {
  mainChatHistory.push({...data, type: "chat"});

  const mentionRegex = /@(\w+)/g;
  const mentions = data.message.match(mentionRegex);
  const isMentioned = mentions && mentions.some(mention =>
    mention.substring(1).toLowerCase() === currentUsername.toLowerCase()
  );

  if (isMentioned && data.username !== currentUsername && currentChat !== "main") {
    playPingSound();
    mainChatPings++;
    updateMainBtn();
  }

  if (currentChat === "main") {
    addMessage(data);
  }
});

socket.on("system-message", (data) => {
  mainChatHistory.push({...data, type: "system"});

  if (currentChat === "main") {
    addSystemMessage(data);
  }
});

socket.on("dm-message", (data) => {
  const chatWith = data.from === currentUsername ? data.to : data.from;

  if (!dmChats.has(chatWith)) {
    dmChats.set(chatWith, []);
    updateDmList();
    saveDmChats();
  }

  dmChats.get(chatWith).push(data);
  saveDmChats();

  if (currentChat === chatWith) {
    addDmMessage(data);
  } else {
    if (data.from !== currentUsername) {
      const currentUnread = unreadCounts.get(chatWith) || 0;
      unreadCounts.set(chatWith, currentUnread + 1);
      updateDmList();
    }
  }
});

socket.on("dm-error", (error) => {
  showError("message", error);
  sendBtn.disabled = false;
});

socket.on("error", (error) => {
  showError("message", error);
  sendBtn.disabled = false;
});

socket.on("online-users", (users) => {
  onlineUsers = users;
  updateOnlineCount();
  console.log("Online users:", users);
});

mainChatBtn.addEventListener("click", () => {
  switchToMainChat();
});

createDmBtn.addEventListener("click", () => {
  const targetUser = prompt("Enter username to DM:");
  if (targetUser && targetUser.trim()) {
    const cleanTarget = targetUser.trim();
    if (cleanTarget.toLowerCase() !== currentUsername.toLowerCase()) {
      createDmChat(cleanTarget);
    } else {
      alert("You cannot DM yourself!");
    }
  }
});

function updateOnlineCount() {
  const onlineCountElement = document.getElementById("online-count");
  const onlineTooltipElement = document.getElementById("online-tooltip");

  if (onlineCountElement && onlineTooltipElement) {
    onlineCountElement.childNodes[0].textContent = `${onlineUsers.length} online`;
    onlineTooltipElement.textContent = onlineUsers.join("\n");
  }
}

function switchToMainChat() {
  currentChat = "main";
  chatTitle.textContent = "Public Chat";

  mainChatPings = 0;
  updateMainBtn();

  mainChatBtn.classList.add("active");
  document.querySelectorAll(".dm-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  messagesContainer.innerHTML = "";
  lastMessageUser = "";
  messageGroups = [];

  if (mainChatHistory.length > 0) {
    mainChatHistory.forEach((msg) => {
      if (msg.type === "chat") {
        addMessage(msg, false);
      } else if (msg.type === "system") {
        addSystemMessage(msg, false);
      }
    });
  }

  messageInput.placeholder = "Message everyone...";
  setTimeout(() => scrollToBottom(), 50);
}

function switchToDmChat(username) {
  currentChat = username;
  chatTitle.textContent = `${username}`;

  unreadCounts.delete(username);
  updateDmList();

  mainChatBtn.classList.remove("active");
  document.querySelectorAll(".dm-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.username === username) {
      btn.classList.add("active");
    }
  });

  messagesContainer.innerHTML = "";
  lastMessageUser = "";
  messageGroups = [];

  if (dmChats.has(username)) {
    dmChats.get(username).forEach((msg) => {
      addDmMessage(msg, false);
    });
  }

  messageInput.placeholder = `Message ${username}...`;
  setTimeout(() => scrollToBottom(), 50);
}

function createDmChat(username) {
  if (!dmChats.has(username)) {
    dmChats.set(username, []);
    updateDmList();
    saveDmChats();
  }
  switchToDmChat(username);
}

function updateDmList() {
  dmList.innerHTML = "";

  dmChats.forEach((messages, username) => {
    const dmBtn = document.createElement("button");
    dmBtn.className = "dm-btn";
    dmBtn.dataset.username = username;

    const dmBtnContent = document.createElement("div");
    dmBtnContent.className = "dm-btn-content";

    const usernameSpan = document.createElement("span");
    usernameSpan.textContent = username;
    dmBtnContent.appendChild(usernameSpan);

    const unreadCount = unreadCounts.get(username) || 0;
    if (unreadCount > 0) {
      const unreadIndicator = document.createElement("span");
      unreadIndicator.className = "unread-indicator";
      unreadIndicator.textContent = unreadCount > 99 ? "99+" : unreadCount.toString();
      dmBtnContent.appendChild(unreadIndicator);
    }

    const closeBtn = document.createElement("span");
    closeBtn.className = "dm-close";
    closeBtn.textContent = "×";
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeDmChat(username);
    };

    dmBtn.appendChild(dmBtnContent);
    dmBtn.appendChild(closeBtn);

    dmBtn.onclick = () => switchToDmChat(username);

    dmList.appendChild(dmBtn);
  });
}

function closeDmChat(username) {
  dmChats.delete(username);
  unreadCounts.delete(username);
  updateDmList();
  saveDmChats();

  if (currentChat === username) {
    switchToMainChat();
  }
}

function addMessage(data, shouldScroll = true) {
  const isOwnMessage = data.username === currentUsername;
  const messageTime = Date.now();

  if (lastMessageUser !== data.username || messageTime - lastMessageTime > 300000) {
    const messageGroup = document.createElement("div");
    messageGroup.className = `message-group ${isOwnMessage ? "own" : ""}`;

    if (!isOwnMessage) {
      const usernameLabel = document.createElement("div");
      usernameLabel.className = "username-label";
      usernameLabel.textContent = data.username;
      messageGroup.appendChild(usernameLabel);
    }

    messagesContainer.appendChild(messageGroup);
    messageGroups.push(messageGroup);
    lastMessageUser = data.username;
  }

  const currentGroup = messageGroups[messageGroups.length - 1];
  const messageElement = document.createElement("div");
  messageElement.className = `message ${isOwnMessage ? "own" : "other"}`;

  if (data.message.includes('@')) {
    const safeHtml = data.message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/@(\w+)/g, '<span class="mention">@$1</span>');
    messageElement.innerHTML = safeHtml;
  } else {
    messageElement.textContent = data.message;
  }
  
  currentGroup.appendChild(messageElement);
  lastMessageTime = messageTime;

  if (shouldScroll) {
    scrollToBottom();
  }
}

function addDmMessage(data, shouldScroll = true) {
  const isOwnMessage = data.from === currentUsername;
  const messageTime = Date.now();

  if (lastMessageUser !== (isOwnMessage ? data.from : data.from) || messageTime - lastMessageTime > 300000) {
    const messageGroup = document.createElement("div");
    messageGroup.className = `message-group ${isOwnMessage ? "own" : ""}`;

    if (!isOwnMessage) {
      const usernameLabel = document.createElement("div");
      usernameLabel.className = "username-label";
      usernameLabel.textContent = data.from;
      messageGroup.appendChild(usernameLabel);
    }

    messagesContainer.appendChild(messageGroup);
    messageGroups.push(messageGroup);
    lastMessageUser = isOwnMessage ? data.from : data.from;
  }

  const currentGroup = messageGroups[messageGroups.length - 1];
  const messageElement = document.createElement("div");
  messageElement.className = `message ${isOwnMessage ? "own" : "other"}`;
  
  if (data.message.includes('@')) {
    const safeHtml = data.message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/@(\w+)/g, '<span class="mention">@$1</span>');
    messageElement.innerHTML = safeHtml;
  } else {
    messageElement.textContent = data.message;
  }
  
  currentGroup.appendChild(messageElement);
  lastMessageTime = messageTime;

  if (shouldScroll) {
    scrollToBottom();
  }
}

function addSystemMessage(data, shouldScroll = true) {
  const systemMessage = document.createElement("div");
  systemMessage.className = "system-message";
  systemMessage.textContent = data.message;
  messagesContainer.appendChild(systemMessage);

  lastMessageUser = "";
  messageGroups = [];

  if (shouldScroll) {
    scrollToBottom();
  }
}

function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function playPingSound() {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

function updateMainBtn() {
  const existingIndicator = mainChatBtn.querySelector('.ping-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }

  if (mainChatPings > 0) {
    const pingIndicator = document.createElement('span');
    pingIndicator.className = 'ping-indicator';
    pingIndicator.textContent = mainChatPings > 99 ? '99+' : mainChatPings.toString();
    mainChatBtn.appendChild(pingIndicator);
  }
}
