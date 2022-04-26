let nameChanged = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ nameChanged });
});