// CONFIG
var time_diff = 30000 // 30 sec
var url = "https://sleepy-meadow-58897.herokuapp.com";
let intervalUpdate;
// var url = "http://localhost:5000"
// console.log(chrome.sessions.device);

// HELPER FUNCTIONS
function timeDifference(current, previous) {
	if (previous) {
		var msPerMinute = 60 * 1000;
		var msPerHour = msPerMinute * 60;
		var msPerDay = msPerHour * 24;
		var msPerMonth = msPerDay * 30;
		var msPerYear = msPerDay * 365;

		var elapsed = current - previous;

		if (elapsed < msPerMinute) {
			return Math.round(elapsed / 1000) + ' seconds ago';
		} else if (elapsed < msPerHour) {
			return Math.round(elapsed / msPerMinute) + ' minutes ago';
		} else if (elapsed < msPerDay) {
			return Math.round(elapsed / msPerHour) + ' hours ago';
		} else if (elapsed < msPerMonth) {
			return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
		} else if (elapsed < msPerYear) {
			return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
		} else {
			return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
		}
	}
}

function startUpdateUser(index) {
	console.log('startUpdateUser')
	intervalUpdate = window.setInterval(function () {
		$.ajax({
				url: url + "/accounts/" + index + "/update",
				method: "PUT"
			})
			.fail(function (data) {
				console.log(data.status, data.statusText);
			})
			.done(function (data) {
				console.log("put update done", data)
			});
	}, time_diff);
}