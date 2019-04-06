var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
const puppeteer = require('puppeteer');

(async () => {
	var emails = fs.readFileSync('email.txt', 'utf8');
	emails = emails.split('\n')

	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto('https://signup.live.com/');
	await page.waitForSelector('#MemberName');
	for (let i = 0; i < emails.length - 6; i++) {
		await page.click("#MemberName", { clickCount: 3 })
		await page.keyboard.press('Backspace')
		await page.type('#MemberName', `${emails[i]}`, { delay: 20 });
		await page.waitForSelector('#domainLabel');
		await page.evaluate(() => {
			document.querySelector('#iSignupAction').click();
		});
		await page.waitFor(1000);

		try {
			await page.waitForSelector('#MemberNameError', { timeout: 1000 })
			console.log("Da dang ky.", emails[i])
		} catch (error) {
			// fs.appendFile('./email-filter.txt', `${email}@${domain}\n`, (err) => {
			// 	if (err) throw err;
			// });
			console.log("Chua dang ky.", emails[i])
			await page.click('#iSignupCancel');
			await page.waitFor(1000);
		}
	}
	await browser.close();
})();


// readEmailFromFile('./email.txt', async (email, domain) => {
// 	(async () => {
// 		const browser = await puppeteer.launch();
// 		const page = await browser.newPage();
// 		await page.goto('https://signup.live.com/');
// 		await page.waitForSelector('#MemberName');
// 		await page.type('#MemberName', `${email}@${domain}`);
// 		await page.click('#iSignupAction');
// 		await page.waitFor(1000);
// 		try {
// 			await page.waitForSelector('#MemberNameError', { timeout: 1000 })
// 			console.log("The element appear.")
// 		} catch (error) {
// 			fs.appendFile('./email-filter.txt', `${email}@${domain}\n`, (err) => {
// 				if (err) throw err;
// 			});
// 		}
// 	})();
// })


// 	(async () => {
// 		const browser = await puppeteer.launch({ headless: false });
// 		const page = await browser.newPage();
// 		await page.goto('https://signup.live.com/');
// 		await page.waitForSelector('#MemberName');

// 		// readEmailFromFile('./email.txt', async (email, domain) => {
// 		// 	console.log(`${email}@${domain}`)
// 		// 	await page.type('#MemberName', `${email}@${domain}`);
// 		// 	// await page.click('#iSignupAction');
// 		// 	// await page.waitFor(1000);
// 		// 	// try {
// 		// 	// 	await page.waitForSelector('#MemberNameError', { timeout: 1000 })
// 		// 	// 	console.log("The element appear.")
// 		// 	// } catch (error) {
// 		// 	// 	console.log("The element didn't appear.")
// 		// 	// }

// 		// })



// 		// await page.type('#MemberName', 'maygnz72@hotmail.com');
// 		// await page.click('#iSignupAction');
// 		// await page.waitFor(1000);
// 		// try {
// 		// 	await page.waitForSelector('#MemberNameError', { timeout: 1000 })
// 		// 	console.log("The element appear.")
// 		// } catch (error) {
// 		// 	console.log("The element didn't appear.")
// 		// }
// 	})();

// // var readEmailFromFile = function (file, callback) {
// // 	var instream = fs.createReadStream(file);
// // 	var outstream = new stream;
// // 	var rl = readline.createInterface(instream, outstream);

// // 	rl.on('line', function (line) {
// // 		if (!/^#/.exec(line)) {
// // 			var elts = line.split('@');
// // 			var email = elts[0];
// // 			var domain = elts[1];
// // 			if (email && domain)
// // 				callback(email, domain);
// // 		}
// // 	});
// // }

// // const mainFn = () => {
// // 	readEmailFromFile('./raw.email.txt', (email, domain) => {
// // 		let content = email + "@" + 'hotmail.com' + '\n'
// // 		fs.appendFile('./email.txt', content, (err) => {
// // 			if (err) throw err;
// // 		});
// // 	})
// // }

// // mainFn()