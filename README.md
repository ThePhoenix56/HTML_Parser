# HTML Parser

A basic HTML parser JavaScript module that parses and returns tags, text and children inside of HTML pages.

## What is this module for?

This module is mainly meant for reading data out of static HTML.
Some typical use cases:

- Scraping static web pages.
- Pulling links, headings or other elements out of an HTML file.
- Extracting plain text from HTML.

As this is a module, it needs further development in order to be used. 

## Features

- Turns an HTML string into a tree of `HtmlElement` objects. This consists of tag name, attributes, text, children and parents.
- Searches the `HtmlElement` tree with familiar DOM-like methods such as:
  - `getElementById(id)`
  - `getElementsByTagName(tagName)`
  - `getElementsByClassName(className)`
  - `getTextContent()`
 - Handles void tags such as `img`, `br`, `input`, `meta`, `link` and `hr`.
 - Reads attributes with `getAttribute(name)` and `hasAttribute(name)`.
 - Can read attributes that are double quoted ("), single-quoted ('), unquoted as well as attributes without a value (such as `disabled`).
 - Does not throw an error on bad input (such as a bad HTML file), it instead returns an empty or partial result if given an empty, non-string or broken HTML file.
 - Does not use any external dependencies and is shipped as an ES module, built only with JavaScript.

## What this module does not do

- This module does not fetch web pages. It only parses a string that is given to it.
- It does not apply CSS or run JS. It only parses HTML sources that are directly fed to it, meaning that any frontend HTML source fed to it that is applied through JS for example is not registered in the module and will therefore not be parsed.
- It does not support CSS selectors such as `querySelector` and `querySelectorAll`.
- It does not decode HTML entities - for example, `&amp;` stays as `&amp;` in plain text.

## Installation and further development

In order to clone this repository and use the module, run the following command inside of a directory:

```bash
git clone git@github.com:ThePhoenix56/HTML_Parser.git
```

This module only utilizes native NodeJS. This module is also not published on the npm page.

## Requirements

- Node.js 14.6/18+: in order to run tests, you need Node 18 as the test suite uses the built in `node:test` runner. The source itself uses ES modules and private class fields which only require Node 14.6+.
- Git: to clone this repository.
- npm: required to run `npm start` and `npm test`.

## Quick start

1. Clone the repository (see [Installation](#installation-and-further-development))

2. Import the parser into your own JS file. Your project has to utilize ES modules, which means that you either specify `"type": "module"` in your package.json file or that the file is a `.mjs` file.

```js
import { HtmlParser } from './HTML_Parser/src/index.js'}
```

3. Create a parser, give it a string of HTML and search the results. Below is example code:
```js
import { HtmlParser } from './HTML_Parser/src/index.js'

const html = `
  <div id="article">
    <h1 class="title">Hello parser</h1>
    <p class="intro">This is the first paragraph!</p>
    <a href="https://google.se" target="_blank">Google</a>
  </div>
`

// Create a parser (one parser can be reused for many HTML strings)
const parser = new HtmlParser()

// Parse the HTML into a document
const doc = parser.parse(html)

// Find an element by its id
const article = doc.getElementById('article')
console.log(article.tagName)                // 'div'

// Find elements by class name
const title = doc.getElementsByClassName('title')[0]
console.log(title.getTextContent())         // 'Hello parser'

// Find elements by tag name and read their attributes
const link = doc.getElementsByTagName('a')[0]
console.log(link.getAttribute('href'))      // 'https://google.se'
console.log(link.hasAttribute('rel'))       // false

// Get all text in the document
console.log(doc.getTextContent())
// 'Hello parser This is the first paragraph! Google'
```

The `parse()` method only accepts a string. To parse an HTML file or a web page, read the file or fetch the page into a string first:

```js
import { readFile } from 'node:fs/promises'

const html = await readFile('page.html', 'utf8')
const doc = parser.parse(html)
```

## API reference
The module exports three classes from `src/index.js`:

```js
import { HtmlParser, HtmlDocument, HtmlElement } from './HTML_Parser/src/index.js'
```

You normally only create an `HtmlParser` yourself. The `HtmlDocument` and the `HtmlElement` objects are created for you when you call `parse()`.

### HtmlParser

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `new HtmlParser()` | `HtmlParser` | Creates a new parser. A parser keeps no state between calls, so one parser can be reused for many HTML strings. |
| `parse(html)` | `HtmlDocument` | Parses an HTML string and returns a document. Empty or non-string input never throws an error. Instead you get a document whose `root` is `null`. |

### HtmlDocument

Returned by `parse()`. Every method is safe to call even when the document is empty.

| Property / method | Returns | Description |
| ----------------- | ------- | ----------- |
| `root` | `HtmlElement` or `null` | The top element of the document (see below). |
| `getElementById(id)` | `HtmlElement` or `null` | The first element whose `id` attribute matches `id` exactly. Returns `null` if no element matches. |
| `getElementsByTagName(tagName)` | `HtmlElement[]` | Every element with that tag name, in the order they appear in the HTML. The tag name is case-insensitive (`'P'` and `'p'` give the same result). Returns `[]` if no element matches. |
| `getElementsByClassName(className)` | `HtmlElement[]` | Every element whose `class` attribute contains `className`. An element with `class="card active"` is found by both `'card'` and `'active'`. Returns `[]` if no element matches. |
| `getTextContent()` | `string` | All text in the document, joined with single spaces. Returns `''` if the document is empty. |

**What `root` contains:**

| Input | `root` |
| ----- | ------ |
| Empty string or not a string | `null` |
| One top-level element, e.g `<div>...</div>` | That element (`root.tagName` is `'div'`) |
| Several top-level elements, e.g `<p>a</p><p>b</p>` | A wrapper element named `'root'` that has the top-level elements as its children |

### HtmlElement

One tag in the document. All elements in the tree are `HtmlElement` objects.

**Properties**

| Property | Type | Description |
| -------- | ---- | ----------- |
| `tagName` | `string` | The tag name in lowercase, e.g. `'div'`, even if the HTML said `<DIV>`. |
| `attributes` | `object` | All attributes as key–value pairs, e.g. `{ id: 'main', class: 'card active' }`. The attribute names are lowercase. |
| `children` | `HtmlElement[]` | The elements directly inside this element, in order. |
| `parent` | `HtmlElement` or `null` | The element this element is inside. |
| `textContent` | `string` | Only the text that sits directly inside this element, not the text inside its children. Use `getTextContent()` to include the children. |

**Methods**

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `getAttribute(name)` | `string` or `null` | The value of the attribute. Returns `null` if the attribute does not exist, and `''` (empty string) for an attribute without a value, such as `disabled`. The name is case-insensitive. |
| `hasAttribute(name)` | `boolean` | `true` if the element has the attribute, otherwise `false`. |
| `getTextContent()` | `string` | The text of this element **and** all elements inside it, joined with single spaces. |
| `getElementById(id)` | `HtmlElement` or `null` | Same as on `HtmlDocument`, but only searches this element and the elements inside it. |
| `getElementsByTagName(tagName)` | `HtmlElement[]` | Same as on `HtmlDocument`, but only searches this element and the elements inside it. |
| `getElementsByClassName(className)` | `HtmlElement[]` | Same as on `HtmlDocument`, but only searches this element and the elements inside it. |
| `addChild(element)` | nothing | Adds a child element and sets its `parent`. Used by the parser when building the tree. |
| `setAttribute(name, value)` | nothing | Sets an attribute. Used by the parser when building the tree. |

**Example: searching inside one element only**

```js
const doc = new HtmlParser().parse(`
  <div>
    <nav><a href="/">Home</a></nav>
    <main id="content">
      <a href="/a">A</a>
      <a href="/b">B</a>
    </main>
  </div>
`)

const main = doc.getElementById('content')
main.getElementsByTagName('a').length   // 2 (the link in <nav> is not counted)
```

## Project structure
```
HTML_Parser/
├── src/
│   ├── index.js           # Exports HtmlParser, HtmlDocument and HtmlElement
│   ├── HTMLParser.js      # HtmlParser: reads an HTML string and builds the element tree
│   ├── HTMLDocument.js    # HtmlDocument: wraps the tree and searches the whole document
│   └── HTMLElement.js     # HtmlElement: one tag with its attributes, text, children and parent
├── test/
│   └── HTMLParser.test.js # Automated tests (run with npm test)
├── TEST_REPORT.md         # Description and results of every test
├── package.json
└── README.md
```

## Running tests

This module is tested with Node's built in test runner (`node:test`), meaning that there is no external dependency that is required to be installed prior to testing.

In order to run the test command:
```bash
cd HTML_Parser
npm test
```

Which should return:

```
ℹ tests 9
ℹ suites 1
ℹ pass 9
```

The test files can be found in [`test/HTMLParser.test.js`](test/HTMLParser.test.js). They cover simple and nested tags, attributes, void/self-closing tags, three search methods and text extraction and empty inputs. A full description of every test can be found in the [`TEST_REPORT.md`](TEST_REPORT.md).

## Contribution

Feature requests, bug reports, etc are to be reported on the GitHub issues page.

## License
This module is licensed under the MIT License.
