let axios = require('axios');
let cheerio = require('cheerio');
let prompt = require('prompt-sync')();
let visitedLinks = [], isFirst = true;
let counter = 0; let firstLink = "";
let option = prompt('Random URL (Y/N)? '); 
let wikiURL = option.toUpperCase() == "Y" ? "https://en.wikipedia.org/wiki/Special:Random" : prompt('Input Wikipedia URL: ');
console.log("Starting Wikipedia URL: " + wikiURL);

function findFirstLink(url) {
	axios.get(url)
	.then((response) => {
		if(response.status === 200) {
			const html = response.data;
			let $ = cheerio.load(html); 
			$("p").each(function() {
				let element = $(this);
				element.html(element.html().replace(/\s*\(.*?\)\s*/g, ''));

			}); 

			$("p i").each(function() {
				$(this).html("");
			}); 
			
			$("p a").each(function() {
				let temp = $(this).attr('href');
				if(temp.indexOf("#") < 0 && isFirst && /^[\x00-\x7F]*$/.test(temp)){
					firstLink = temp;
					isFirst = false;
				}
			});
			console.log(firstLink.substring(6).replaceAll("_", " "));
			firstLink = "https://en.wikipedia.org" + firstLink;
			setTimeout(() => {isPhilosophy(firstLink)}, 1000);
		}
	}, 
	(error) => console.log(error) );
}

function isPhilosophy(url) {
	counter++;
	if(url.toLowerCase() == "https://en.wikipedia.org/wiki/philosophy"){
		console.log("It took " + counter + " tries!")
	}
	else if(visitedLinks.includes(url)){
		console.log("Stuck in a loop. Sorry. Try Again!")
	}
	else{
		firstLink = ""; isFirst = true;
		visitedLinks.push(url);
		findFirstLink(url);
	}
}

findFirstLink(wikiURL);
