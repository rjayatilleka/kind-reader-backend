#!/usr/bin/env node

const read = require('node-readability');
const toMarkdown = require('to-markdown');
const striptags = require('striptags');
const cheerio = require('cheerio');

read(process.argv[2], (err, article, meta) => {
	if (err) throw err;

  console.log('Title:', article.title);
	const $ = cheerio.load(article.content);
	
	// For each link, add to URL->text map.
	// Then replace with the text
	const urlsToText = new Map();

	$('a').each((i, e) => {
		urlsToText.set($(e).attr('href'), $(e).text());
		$(e).replaceWith($(e).text());
	});

  console.log(striptags(toMarkdown($.html())));

  article.close();
});
