fetch('https://sleepy-meadow-58897.herokuapp.com/accounts')
	.then(response => response.json())
	.then(data => console.log(data));

fetch('https://sleepy-meadow-58897.herokuapp.com/accounts/1/active', {method: "PUT"})
	.then(response => response.json())
	.then(data => console.log(data));

fetch('https://sleepy-meadow-58897.herokuapp.com/accounts')
	.then(response => response.json())
	.then(data => console.log(data));