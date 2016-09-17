#!/usr/bin/env node

const read = require('node-readability');
const toMarkdown = require('to-markdown');

const url = process.argv[2];

read(url, function(err, article, meta) {
  console.log('Title:', article.title);
  console.log('Content:', toMarkdown(article.content));

// toMarkdown('<h1>Hello world!</h1>');
  article.close();
});
