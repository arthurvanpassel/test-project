let inputs = $(".password");
let submits = $(".submit");
let passwords = [];

// Load the locally saved passwords into the inputs
chrome.storage.sync.get("passwords", (data) => {
	passwords = data.passwords;
	console.log("passwords",passwords)
	for (let i = 0; i < inputs.length; i++) {
		const element = inputs[i];
		$(element).val(passwords[i])
	}
});

// Save password
submits.on("click", function () {
	let input = $(this).siblings(".password");
	passwords[$(input).attr("data-id")] = $(input).val();
	chrome.storage.sync.set({ passwords });
	$(this).siblings(".success").show().delay(5000).fadeOut();
})