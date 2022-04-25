// CONFIG
var time_diff = 30000 // 30 sec
var url = "https://sleepy-meadow-58897.herokuapp.com";
let username, intervalUpdate;
chrome.storage.sync.get("username", (data) => {
	username = data.username;
});
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
	} else {
		return 'about a day ago'
	}
}

function startUpdateUser(index) {
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

$("body").prepend("<div class='login-info waiting'><div class='lds-roller'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>")
var div = $(".login-info");
$.get(url + "/accounts")
	.always(function () {
		div.removeClass("waiting");
	})
	.fail(function (data) {
		div.addClass("error");
		div.prepend(`<span>${data.status} ${data.statusText}</span>`);
	})
	.done(function (data) {
		if (data.status == "OK") {
			for (let i = 0; i < data.message.length; i++) {
				const element = data.message[i];
				const d = new Date();
				let time = d.getTime();
				var still_active = time - element.last_update <= time_diff;
				var current_user_active = still_active && element.user == username
				var details = "",
					status = "",
					statusText = "",
					action = "";
				if (current_user_active) {
					status = "using";
					statusText = "USING";
					details = `
						<div class="user"><strong>Currently using: </strong>${element.user}</div>
						<div class="time-info"><strong>Using since: </strong>${timeDifference(time, element.last_login)}</div>
					`;
					action = `<a class="action endSession" href="#">End session</a>`
					startUpdateUser(i);
				} else if (still_active) {
					status = "inUse";
					statusText = "IN USE";
					details = `
						<div class="user"><strong>Currently using: </strong>${element.user}</div>
						<div class="time-info"><strong>Using since: </strong>${timeDifference(time, element.last_login)}</div>
					`
				} else {
					status = "available";
					statusText = "AVAILABLE";
					details = `
						<div class="user"><strong>Last user: </strong>${element.user}</div>
						<div class="time-info"><strong>Last active: </strong>${timeDifference(time, element.last_update)}</div>
					`
					action = `<a class="action fillIn" href="#">Fill in</a>`
				}


				var html = `
					<div class="login-item" id="${i}">
						<div class="top">
							<div class="status ${status}">${statusText}</div>
							<div class="email">${element.login}</div>
							${action}
						</div>
						<details>
							<summary></summary>
							${details}
						</details>
					</div>
				`
				div.append(html);
			}

			$(".login-info .action").on('click', function (e) {
				e.preventDefault();
				const current = this
				if ($(current).hasClass('fillIn')) {
					var index = $(current).parents(".login-item").attr("id");
					$.ajax({
							url: url + "/accounts/" + index + "/active",
							method: "PUT",
							data: {
								user: username
							}
						})
						.fail(function (data) {
							div.addClass("error");
							div.prepend(`<span>${data.status} ${data.statusText}</span>`);
						})
						.done(function (data) {
							console.log("put active done", data)
							$(current).siblings(".status").removeClass("available").addClass("using").text("USING");
							$(current).removeClass("fillIn").addClass("endSession").text("End session");
							startUpdateUser(index);
						});
				} 
				else if ($(current).hasClass('endSession')) {
					console.log("end session")
					var index = $(current).parents(".login-item").attr("id");
					clearInterval(intervalUpdate);
					$(current).siblings(".status").removeClass("using").addClass("available").text("AVAILABLE");
					$(current).removeClass("endSession").addClass("fillIn").text("Fill in");
				}
			})

		} else {
			div.addClass("error");
			div.prepend(`<span>${data.message}</span>`);
		}
	});