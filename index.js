var fs = require('fs')
var axios = require('axios')
var faker = require('faker')
const Nightmare = require('nightmare')

const crawlProxies = new Promise((resolve, reject) => {
	const nightmare = Nightmare()
	try {
		nightmare
			.goto('http://www.proxyserverlist24.top/2019/03/04-03-19-fast-proxy-server-list_18.html')
			.wait(1000)
			.evaluate(() => document.querySelector('.post-body > pre > span > span:nth-child(2)').textContent)
			.end()
			.then(resolve)
			.catch(error => reject(error))
	} catch (error) {
		reject(error)
	}
})

const getValidProxies = async () => {
	var proxies = await crawlProxies
	var arrProxies = proxies.trim().split('\n')

	for (let i = 0, l = arrProxies.length; i < l; i++) {
		let line = arrProxies[i].split(':')
		let host = line[0]
		var port = line[1]

		try {
			const response = await axios({
				method: 'get',
				url: 'http://www.example.com',
				proxy: {
					host: host,
					port: port
				},
				headers: {
					'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36.'
				}
			})

			if (response.status === 200) {
				console.log(arrProxies[i])
			}

		} catch (error) {
			// console.log(`error`)
		}
	}
}

const emailGenerator = (num = 10, domain = 'yahoo.com', locale = "vi", firstName, lastName, ) => {
	faker.locale = locale
	var results = []
	for (let i = 0; i < num; i++) {
		results.push(faker.internet.email(firstName, lastName, domain).toLocaleLowerCase())
	}
	return [...new Set(results)]
}

const checkNotRegHotMail = async (emails) => {
	const results = []
	const nightmare = Nightmare({ show: false })

	await nightmare.goto('https://signup.live.com/')
	await nightmare.wait('#MemberName')
	for (let i = 0, l = emails.length; i < l; i++) {
		await nightmare.insert('#MemberName', false)
		await nightmare.insert('#MemberName', emails[i])
		await nightmare.wait('#domainLabel')
		await nightmare.click('#iSignupAction')
		await nightmare.wait(1000)
		var result = await nightmare.evaluate(() => document.querySelector('#MemberNameError'))
		if (!result) {
			results.push(emails[i])
			await nightmare.click('#iSignupCancel');
			await nightmare.wait(1000);
		}
	}

	await nightmare.end()
	return results;
}

const checkNotRegYahoo = async (emails) => {
	const results = []
	const nightmare = Nightmare({ show: false })

	await nightmare.goto('https://login.yahoo.com/account/create')
	await nightmare.wait('#usernamereg-yid')
	for (let i = 0, l = emails.length; i < l; i++) {
		await nightmare.insert('#usernamereg-yid', false)
		await nightmare.insert('#usernamereg-yid', emails[i].split('@')[0])
		await nightmare.click('body')
		await nightmare.wait(2000)
		var result = await nightmare.evaluate(() => document.querySelector('#reg-error-yid').textContent === '')
		if (result) {
			results.push(emails[i])
		}
	}

	await nightmare.end()
	return results;
}

const checkFacebookEmail = async (emails) => {
	const results = []
	const nightmare = Nightmare({ show: false })

	await nightmare.goto('https://www.facebook.com/login/identify/?ctx=recover&ars=royal_blue_bar')
	await nightmare.wait('#identify_email')
	for (let i = 0, l = emails.length; i < l; i++) {
		await nightmare.insert('#identify_email', false)
		await nightmare.insert('#identify_email', emails[i])
		await nightmare.click('#did_submit')
		await nightmare.wait(1000)

		var result = await nightmare.evaluate(() => document.querySelector('a[name="reset_action"]'))
		var emptyInput = await nightmare.evaluate(() => document.querySelector('#identify_email'))

		if (result) {
			results.push(emails[i])
			await nightmare.back()
			await nightmare.wait(1000)
		}
		if (!result && !emptyInput) {
			await nightmare.back()
		}
	}
	await nightmare.end()
	return results;
}


(async () => {
	var emails1 = emailGenerator(1, 'hotmail.com', 'vi')
	var notRegEmail1 = await checkNotRegHotMail(emails1);

	var emails2 = emailGenerator(1, 'yahoo.com', 'vi')
	var notRegEmail2 = await checkNotRegYahoo(emails2)

	var results = await checkFacebookEmail([...notRegEmail1, ...notRegEmail2])

	fs.writeFileSync('./data/via.txt', results.join('\n'), 'utf-8')

})()
