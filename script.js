// CONFIG
var time_diff = 30000 // 30 sec
// console.log(chrome.sessions.device);

// HELPER FUNCTIONS
function timeDifference(current, previous) {
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

$("body").prepend("<div class='login-info waiting'><div class='lds-roller'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>")
var div = $(".login-info");
$.get("https://sleepy-meadow-58897.herokuapp.com/accounts")
	.always(function () {
		div.removeClass("waiting");
	})
	.fail(function (data) {
		div.addClass("error");
		div.prepend(`<span>${data.status} ${data.statusText}</span>`);
	})
	.done(function (data) {
		console.log("done", data)
		if (data.status == "OK") {
			for (let i = 0; i < data.message.length; i++) {
				const element = data.message[i];
				const d = new Date();
				let time = d.getTime();
				console.log(i, time - element.last_update)
				console.log(i, timeDifference(time, element.last_update))
				var still_active = element.active && time - element.last_update <= time_diff;

				var html = `
					<div class="login-item" id="${i}">
						<div class="top">
							<div class="status ${still_active ? "inUse" : "available"}">${still_active ? "IN USE" : "AVAILABLE"}</div>
							<div class="email">${element.login}</div>
							<a class="fillIn" href="#">Fill in</a>
						</div>
						<details>
						<summary></summary>
							<div class="time-info"><strong>Last active: </strong>${timeDifference(time, element.last_update)}</div>
						</details>
					</div>
				`
				div.append(html);
			}

			$(".login-info .fillIn").on('click', function (e) {
				e.preventDefault();
				const current = this
				var index = $(current).parents(".login-item").attr("id")
				var intervalScroll = window.setInterval(function putFunction() {
					$.ajax({
							url: "https://sleepy-meadow-58897.herokuapp.com/accounts/" + index + "/active",
							method: "PUT"
						})
						.fail(function (data) {
							div.addClass("error");
							div.prepend(`<span>${data.status} ${data.statusText}</span>`);
						})
						.done(function (data) {
							console.log("put done",data)
							$(current).siblings(".status").removeClass("available").addClass("using").text("USING")
						});
					return putFunction;
				}(), time_diff);
			})
		} else {
			div.addClass("error");
			div.prepend(`<span>${data.message}</span>`);
		}
	});


// fetch('https://sleepy-meadow-58897.herokuapp.com/accounts/1/active', {method: "PUT"})
// 	.then(response => response.json())
// 	.then(data => console.log(data));