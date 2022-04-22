// When the button is clicked, inject setPageBackgroundColor into current page
chrome.storage.sync.get("username", (data) => {
  let username = data.username;
  console.log(username)
  document.querySelector("#userName").setAttribute('value', username)
  document.querySelector("#submitName").addEventListener("click", function () {
    console.log(this)
    // let [tab] = await chrome.tabs.query({
    //   active: true,
    //   currentWindow: true
    // });
  
    // chrome.scripting.executeScript({
    //   target: {
    //     tabId: tab.id
    //   },
    //   function: function setPageBackgroundColor() {
    //     // The body of this function will be executed as a content script inside the current page
    //     chrome.storage.sync.get("color", ({
    //       color
    //     }) => {
    //       document.body.style.backgroundColor = color;
    //     });
    //   },
    // });
  });
});