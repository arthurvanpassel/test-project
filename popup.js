chrome.storage.sync.get("username", (data) => {
  let username = data.username;
  $("#userName").val(username)
  $("#submitName").on("click", function () {
    username = $("#userName").val()
    chrome.storage.sync.set({ username });
    $(".success").show().delay(5000).fadeOut();
  });
  $("#passwordsLink").on('click', function () {
		chrome.runtime.sendMessage({"action": "openOptionsPage"});
  })
});