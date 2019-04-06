var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var readEmailFromFile = function (file, callback) {
	var instream = fs.createReadStream(file);
	var outstream = new stream;
	var rl = readline.createInterface(instream, outstream);

	rl.on('line', function (line) {
		if (!/^#/.exec(line)) {
			var elts = line.split('@');
			var email = elts[0];
			var domain = elts[1];
			if (email && domain)
				callback(email, domain);
		}
	});
}

const mainFn = () => {
	readEmailFromFile('./raw.email.txt', (email, domain) => {
		let content = email + "@" + 'hotmail.com' + '\n'
		fs.appendFile('./email.txt', content, (err) => {
			if (err) throw err;
		});
	})
}

mainFn()

module.exports = {
	readEmailFromFile: readEmailFromFile
}