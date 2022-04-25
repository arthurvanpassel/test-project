// When the button is clicked, inject setPageBackgroundColor into current page
chrome.storage.sync.get("username", (data) => {
  let username = data.username;
  document.querySelector("#userName").setAttribute('value', username)
  document.querySelector("#submitName").addEventListener("click", function () {
    username = document.querySelector("#userName").value
    chrome.storage.sync.set({ username });
    console.log('Random username set to', `username: ${username}`);
  });
});