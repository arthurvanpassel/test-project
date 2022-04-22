// CONFIG
var time_diff = 30000 // 30 sec
var url = "https://sleepy-meadow-58897.herokuapp.com"
var url = "http://localhost:5000"
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
		console.log("done", data)
		if (data.status == "OK") {
			for (let i = 0; i < data.message.length; i++) {
				const element = data.message[i];
				const d = new Date();
				let time = d.getTime();
				console.log(i, time - element.last_update)
				console.log(i, timeDifference(time, element.last_update))
				var still_active = time - element.last_update <= time_diff;

				var html = `
					<div class="login-item" id="${i}">
						<div class="top">
							<div class="status ${still_active ? "inUse" : "available"}">${still_active ? "IN USE" : "AVAILABLE"}</div>
							<div class="email">${element.login}</div>
							<a class="fillIn" href="#">Fill in</a>
						</div>
						<details>
						<summary></summary>
				`;
				if (still_active) {
					html += `
						<div class="user"><strong>Currently using: </strong>${element.user}</div>
						<div class="time-info"><strong>Using since: </strong>${timeDifference(time, element.last_login)}</div>
					`
				} else {
					html += `<div class="time-info"><strong>Last active: </strong>${timeDifference(time, element.last_update)}</div>`
				}
				html += `
						</details>
					</div>
				`
				div.append(html);
			}

			$(".login-info .fillIn").on('click', function (e) {
				e.preventDefault();
				const current = this
				var index = $(current).parents(".login-item").attr("id");
				$.ajax({
						url: url + "/accounts/" + index + "/active",
						method: "PUT",
						data: {
							user: "Arthur"
						}
					})
					.fail(function (data) {
						div.addClass("error");
						div.prepend(`<span>${data.status} ${data.statusText}</span>`);
					})
					.done(function (data) {
						console.log("put active done", data)
						$(current).siblings(".status").removeClass("available").addClass("using").text("USING")
					});
				var intervalScroll = window.setInterval(function () {
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
			})
		} else {
			div.addClass("error");
			div.prepend(`<span>${data.message}</span>`);
		}
	});


// fetch(url + '/accounts/1/active', {method: "PUT"})
// 	.then(response => response.json())
// 	.then(data => console.log(data));