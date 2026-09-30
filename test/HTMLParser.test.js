import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { HtmlParser } from '../src/index.js'

describe('HtmlParser Test Suite', () => {
    const parser = new HtmlParser()

    it('should parse a single simple tag with text', () => {
        const html = '<p>Hello World</p>'
        const doc = parser.parse(html)
        const p = doc.root

        assert.equal(p.tagName, 'p')
        assert.equal(p.getTextContent(), 'Hello World')
    })

    it('should parse nested elements correctly', () => {
        const html = '<div><h1>Title</h1><p>Paragraph</p></div>'
        const doc = parser.parse(html)

        assert.equal(doc.root.tagName, 'div')
        assert.equal(doc.root.children.length, 2)
        assert.equal(doc.root.children[0].tagName, 'h1')
        assert.equal(doc.root.children[1].tagName, 'p')
    })

    it('should parse attributes with quotes and unquoted values', () => {
        const html = '<a href="https://lnu.se" id="main-link" target="_blank">LNU</a>'
        const doc = parser.parse(html)
        const link = doc.root

        assert.equal(link.getAttribute('href'), 'https://lnu.se')
        assert.equal(link.getAttribute('id'), 'main-link')
        assert.equal(link.getAttribute('target'), '_blank')
        assert.equal(link.hasAttribute('href'), true)
        assert.equal(link.hasAttribute('missing'), false)
    })

    it('should handle self-closing and void tags without breaking the tree', () => {
        const html = '<div><img src="pic.jpg" /><p>After image</p></div>'
        const doc = parser.parse(html)

        assert.equal(doc.root.children.length, 2)
        assert.equal(doc.root.children[0].tagName, 'img')
        assert.equal(doc.root.children[1].tagName, 'p')
    })

    it('should find elements by ID', () => {
        const html = '<section><div id="target-box"><p>Inside target</p></div></section>'
        const doc = parser.parse(html)

        const found = doc.getElementById('target-box')
        assert.notEqual(found, null)
        assert.equal(found.tagName, 'div')
        assert.equal(doc.getElementById('non-existent'), null)
    })

    it('should find elements by tag name', () => {
        const html = '<ul><li>One</li><li>Two</li><li>Three</li></ul>'
        const doc = parser.parse(html)

        const listItems = doc.getElementsByTagName('li')
        assert.equal(listItems.length, 3)
        assert.equal(listItems[0].getTextContent(), 'One')
        assert.equal(listItems[2].getTextContent(), 'Three')
    })

    it('should find elements by CSS class name', () => {
        const html = `
      <div>
        <p class="highlight">Item 1</p>
        <p class="normal">Item 2</p>
        <span class="highlight bold">Item 3</span>
      </div>
    `
        const doc = parser.parse(html)

        const highlights = doc.getElementsByClassName('highlight')
        assert.equal(highlights.length, 2)
        assert.equal(highlights[0].tagName, 'p')
        assert.equal(highlights[1].tagName, 'span')
    })

    it('should extract combined text from the entire document', () => {
        const html = '<div><h1>Main Header</h1><p>Some body text.</p></div>'
        const doc = parser.parse(html)

        assert.equal(doc.getTextContent(), 'Main Header Some body text.')
    })

    it('should safely handle empty or invalid input', () => {
        const emptyDoc = parser.parse('')
        assert.equal(emptyDoc.root, null)
        assert.equal(emptyDoc.getElementById('test'), null)
        assert.deepEqual(emptyDoc.getElementsByTagName('p'), [])
    })
})
