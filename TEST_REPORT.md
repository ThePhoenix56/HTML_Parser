# Test Report

<!--
    Commit this file to the root of your GitHub repository, alongside your module's code.
    It is required regardless of how you tested your module — even if your tests live in a
    test application or use a testing framework, summarize them here.
-->

## Summary

This module was tested through a series of automated scripts using Node's built in test runner (node assert and node test). The tests themselves mainly verified that HTML tags are correctly identified, parsed and assigned their correct tag name and text.
All tests were ran with the "**npm test**" command.

## Test Results

| What was tested | How it was tested | Result |
| ---------------- | ------------------ | ------- |
| `HtmlParser.parse()` with a single HTML tag and text. | Automated unit test: parsed `<p>Hello World</p>` and returned `'p'` in `tagName` and `Hello World` in getTextContent(). | ✅ Passed |
| `HtmlParser.parse()` with nested elements. | Automated unit test:  parsed `<div><h1>Title</h1><p>Paragraph</p></div>` and verified children count and children tag names. | ✅ Passed |
| `HtmlParser.getAttribute()` and `hasAttribute()`. | Automated unit test: parsed `<a href="https://lnu.se" id="main-link" target="_blank">` and verified that attribute values match and missing attributes return null. | ✅ Passed |
| Handling self-closing and void tags (`<img>` and `br` tags). | Automated unit test: parsed `<div><img src="pic.jpg" /><p>After image</p></div>` and verified that the tree structure is preserved without breaking the stack. | ✅ Passed |
| `HtmlDocument.getElementById(id)` | Automated unit test: searched for an existing ID (`target-box`) and a non-existing ID (`non-existent`), checking for correct node and `null` return. | ✅ Passed |
| `HtmlDocument.getElementsByTagName(tagName)` | Automated unit test: parsed a `<ul>` with three `<li>` items and verified that all 3 elements were returned in an array with correct text. | ✅ Passed |
| `HtmlDocument.getElementsByClassName(className)` | Automated unit test: parsed elements with single and multiple classes (`class="highlight bold"`) and verified matching elements were found. | ✅ Passed |
| `HtmlDocument.getTextContent()` across entire document | Automated unit test: parsed a document with multiple nested tags and verified that combined text is concatenated with clean spacing. | ✅ Passed |
|  Handling empty or invalid input in `HtmlParser.parse()` | Automated unit test: called `parse('')` with an empty string and verified that `root` is `null` and search methods return safe defaults (`null` or `[]`) without crashing. | ✅ Passed |

**Tests: 9**
**Tests successful: 9**
**Tests failed: 0**