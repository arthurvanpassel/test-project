let nameChanged = false;
let passwords = Array(4)

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ nameChanged, passwords });
});

chrome.runtime.onMessage.addListener(function(message) {
  switch (message.action) {
      case "openOptionsPage":
          openOptionsPage();
          break;
      default:
          break;
  }
});

function openOptionsPage(){
  chrome.runtime.openOptionsPage();
}