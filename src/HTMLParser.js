import { HtmlElement } from './HTMLElement.js'
import { HtmlDocument } from './HTMLDocument.js'

/**
 * HtmlParser turns a raw HTML string into a tree of HtmlElement objects.
 */
export class HtmlParser {
    // Tags that never have a closing tag in HTML (self-closing tags)
    #voidTags = ['img', 'br', 'hr', 'input', 'meta', 'link']

    /**
     * Parses an HTML string and returns an HtmlDocument.
     * @param {string} html - Raw HTML text.
     * @returns {HtmlDocument}
     */
    parse(html) {
        if (!this.#isValidInput(html)) {
            return new HtmlDocument(null)
        }

        const root = this.#buildTree(html)
        return new HtmlDocument(this.#choosePrimaryElement(root))
    }

    /**
     * Checks that the input is a non-empty string.
     * @param {*} html
     * @returns {boolean}
     */
    #isValidInput(html) {
        return typeof html === 'string' && html.length > 0
    }

    /**
     * Reads the whole HTML string and builds a tree under an invisible root element.
     * @param {string} html
     * @returns {HtmlElement} The invisible root element.
     */
    #buildTree(html) {
        const root = new HtmlElement('root')

        // Stack to keep track of which parent tag we are currently inside.
        // The top item is always the current parent.
        const stack = [root]

        let cursor = 0
        while (cursor < html.length) {
            cursor = html[cursor] === '<'
                ? this.#readTag(html, cursor, stack)
                : this.#readText(html, cursor, stack)
        }

        return root
    }

    /**
     * Reads one tag starting at the cursor and processes it.
     * @param {string} html
     * @param {number} cursor - Index of the "<" character.
     * @param {HtmlElement[]} stack
     * @returns {number} The cursor position after the tag.
     */
    #readTag(html, cursor, stack) {
        const tagEndIndex = html.indexOf('>', cursor)

        if (tagEndIndex === -1) {
            return html.length
        }

        const rawTagContent = html.slice(cursor + 1, tagEndIndex).trim()
        this.#processTag(rawTagContent, stack)

        return tagEndIndex + 1
    }

    /**
     * Reads text from the cursor up to the next tag and processes it.
     * @param {string} html
     * @param {number} cursor
     * @param {HtmlElement[]} stack
     * @returns {number} The cursor position after the text.
     */
    #readText(html, cursor, stack) {
        const nextTagIndex = html.indexOf('<', cursor)
        const textEndIndex = nextTagIndex === -1 ? html.length : nextTagIndex

        this.#processText(html.slice(cursor, textEndIndex), stack)

        return textEndIndex
    }

    /**
     * Returns the only top-level element if there is exactly one, otherwise the invisible root.
     * @param {HtmlElement} root
     * @returns {HtmlElement}
     */
    #choosePrimaryElement(root) {
        return root.children.length === 1 ? root.children[0] : root
    }

    /**
     * Checks if the tag is an opening or closing tag.
     * @param {string} rawTagContent 
     * @param {HtmlElement[]} stack 
     */
    #processTag(rawTagContent, stack) {
        if (rawTagContent.startsWith('/')) {
            this.#handleClosingTag(rawTagContent, stack)
        } else {
            this.#handleOpeningTag(rawTagContent, stack)
        }
    }

    /**
     * Handles closing tags by removing the element from the top of the stack.
     * @param {string} rawTagContent - for example "/div"
     * @param {HtmlElement[]} stack 
     */
    #handleClosingTag(rawTagContent, stack) {
        const tagName = rawTagContent.slice(1).trim().toLowerCase()

        // Pop element if name matches the top of the stack
        if (stack.length > 1) {
            const currentElement = stack[stack.length - 1]
            if (currentElement.tagName === tagName) {
                stack.pop()
            }
        }
    }

    /**
     * Handles opening tags: creates a new element, reads attributes, and adds it to the stack.
     * @param {string} rawTagContent - for example "div id='main' class='card'"
     * @param {HtmlElement[]} stack 
     */
    #handleOpeningTag(rawTagContent, stack) {
        // A tag ending with "/" is self-closing (for example <img src="example.jpg" />)
        const isExplicitSelfClosing = rawTagContent.endsWith('/')
        const cleanTag = isExplicitSelfClosing ? rawTagContent.slice(0, -1).trim() : rawTagContent

        const { tagName, attributeString } = this.#splitTagNameAndAttributes(cleanTag)
        const newElement = this.#createElement(tagName, attributeString)

        stack[stack.length - 1].addChild(newElement)

        if (this.#expectsClosingTag(newElement, isExplicitSelfClosing)) {
            stack.push(newElement)
        }
    }

    /**
     * Splits tag content into the tag name and the attribute string.
     * @param {string} cleanTag - for example "div id='main'"
     * @returns {{ tagName: string, attributeString: string }}
     */
    #splitTagNameAndAttributes(cleanTag) {
        const firstSpaceIndex = cleanTag.indexOf(' ')

        if (firstSpaceIndex === -1) {
            return { tagName: cleanTag, attributeString: '' }
        }

        return {
            tagName: cleanTag.slice(0, firstSpaceIndex),
            attributeString: cleanTag.slice(firstSpaceIndex + 1).trim()
        }
    }

    /**
     * Creates a new element and reads its attributes, if there are any.
     * @param {string} tagName
     * @param {string} attributeString
     * @returns {HtmlElement}
     */
    #createElement(tagName, attributeString) {
        const element = new HtmlElement(tagName)

        if (attributeString.length > 0) {
            this.#parseAttributes(attributeString, element)
        }

        return element
    }

    /**
     * Checks if the element will be closed by a later closing tag (for example, it can have children).
     * @param {HtmlElement} element
     * @param {boolean} isExplicitSelfClosing
     * @returns {boolean}
     */
    #expectsClosingTag(element, isExplicitSelfClosing) {
        const isVoidTag = this.#voidTags.includes(element.tagName)
        return !isExplicitSelfClosing && !isVoidTag
    }

    /**
     * Reads attributes like id="test" class="btn" and saves them to the element.
     * @param {string} attrString 
     * @param {HtmlElement} element 
     */
    #parseAttributes(attrString, element) {
        // Regex that finds key="value", key='value', or just key
        const attributePattern = /([a-zA-Z0-9_-]+)(?:=(?:["']([^"']*)["']|([^>\s]+)))?/g

        let match
        while ((match = attributePattern.exec(attrString)) !== null) {
            const name = match[1]
            // Value can be inside quotes (group 2) or without quotes (group 3)
            const value = match[2] !== undefined ? match[2] : match[3] || ''
            element.setAttribute(name, value)
        }
    }

    /**
     * Cleans up text and adds it to the current element on the stack.
     * @param {string} text 
     * @param {HtmlElement[]} stack 
     */
    #processText(text, stack) {
        const cleanedText = text.trim()
        if (cleanedText.length > 0 && stack.length > 0) {
            const currentElement = stack[stack.length - 1]
            currentElement.textContent += (currentElement.textContent ? ' ' : '') + cleanedText
        }
    }
}
