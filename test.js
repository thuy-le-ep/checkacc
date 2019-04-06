const Nightmare = require('nightmare')
const nightmare = Nightmare({
	show: true,
	switches: {
		'proxy-server': '1.10.186.167:51907'
	},
})

nightmare
	.goto('https://duckduckgo.com')
	.type('#search_form_input_homepage', 'github nightmare')
	.click('#search_button_homepage')
	.wait('#r1-0 a.result__a')
	.evaluate(() => document.querySelector('#r1-0 a.result__a').href)
	.end()
	.then(console.log)
	.catch(error => {
		console.error('Search failed:', error)
	})