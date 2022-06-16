const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'ce47f640e6msh4de3cba4491ad13p164bbejsna395f7724c5c',
		'X-RapidAPI-Host': 'chess-puzzles.p.rapidapi.com'
	}
};

fetch('https://chess-puzzles.p.rapidapi.com/?rating=1500&themesType=ALL&count=25', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));