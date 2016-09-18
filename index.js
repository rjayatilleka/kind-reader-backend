#!/usr/bin/env node

const exec = require('child_process').exec;

const read = require('node-readability');
const cheerio = require('cheerio');

const toMarkdown = require('to-markdown');
const striptags = require('striptags');

read(process.argv[2], (err, article, meta) => {
	try {
		if (err) throw err;

		const title = article.title;
		let nextUrl, prevUrl;

		const $ = cheerio.load(article.content);

		$('a').each((i, element) => {
			const $e = $(element);

			if ($e.text().search(/next/i) >= 0) {
				nextUrl = $e.attr('href');
				$e.remove();
			} else if ($e.text().search(/prev/i) >= 0) {
				prevUrl = $e.attr('href');
				$e.remove();
			}
		});

		// sed -E -e $'1,/[[:alnum:]]/ {\n  /^[^[:alnum:]]*$/d\n}'

		const rawMd = striptags(toMarkdown($.html()));

		const niceifyCmd = 'pandoc --from=markdown --to=html | pandoc --from=html --to=markdown';
		const cleanFrontEndCmd = 'sed -E -e $\'1,/[[:alnum:]]/ {\\n  /^[^[:alnum:]]*$/d\\n}\'';
		const flipCmd = 'tail -r';

		const cmd = niceifyCmd +
			' | ' + cleanFrontEndCmd +
			' | ' + flipCmd +
			' | ' + cleanFrontEndCmd +
			' | ' + flipCmd;

		const formatProcess = exec(cmd,
				(err, stdout, stderr) => {
					console.log(stdout);
				});
		formatProcess.stdin.write(rawMd);
		formatProcess.stdin.end();
	} finally {
		if (article) article.close();
	}
});
