# HTML Parser

A basic HTML parser JavaScript module that parses and returns tags, text and children inside of HTML pages.

## What is this module for?

This module is mainly meant for reading data out of static HTML.
Some typical uses cases:

- Scraping static web pages.
- Pulling links, headings or other elements out of an HTML file.
- Extracting plain text from HTML.

As this is a module, it needs further development in order to be used. 

## Features

- Turns an HTML string into a tree of `HtmlElement` objects. This consists of tag name, attributes, text, children and parents.
- Searches the `HtmlElement` tree with familiar DOM-like methods such as:
  - `getElementById(id)`
  - `getElementByTagName(tagName)`
  - `getElementsByClassName(className)`
  - `getTextContent()`
 - Handles void tags such as `img`, `br`, `input`, `meta`, `link`, etc.
 - Reads attributes with `getAttribute(name` and `hasAttribute(name`.
 - Can read attributes that are double quoted ("), single-quoted ('), unquoted as well as attributes without a value (such as `disabled`).
 - Does not throw an error on bad input (such as a bad HTML file), it instead returns an empty or partial result if given an empty, non-string or broken HTML file.
 - Does not use any external dependencies and is shipped as an ES module, built only with JavaScript.

## What this module does not do

- This module does not fetch web pages. It only parses a string or HTML file that is given to it.
- It does not apply CSS or run JS. It only parses HTML sources that are directly fed to it, meaning that any frontend HTML source fed to it that is applied through JS for example is not registered in the module and will therefore not be parsed.
- It does not support CSS selectors such as `querySelector` and `querySelectorAll`.
- It does not decode HTML entities - for example, `&amp` stays as `&amp` in plain text.

## Does it work out of the box?

No. You have to incorporate this module into your own app.

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
