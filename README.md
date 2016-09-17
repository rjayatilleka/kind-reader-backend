# kind-reader-backend

Download web page, extract content, and convert to markdown

Input: url
Output: First line title, rest is Markdown of extract

Need to distinguish between images and article URLs

## Vim mechanism

```
:execute 'new KindReader-tempname' . g:KindReader-count
let g:KindReader-count = g:KindReader-count + 1
:set buftype=nofile
:set noswapfile
:r! kind-reader <url>
gg
:s/ /\\ /g
:s/|/\\|/g
:s/\\/\\\\/g
"ay$
:execute 'file' @a
"_dd
:set nomodifiable
```

