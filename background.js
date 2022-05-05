let nameChanged = false;
let passwords = Array(4)

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ nameChanged, passwords });
});