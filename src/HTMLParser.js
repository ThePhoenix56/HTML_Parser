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
        // Return an empty document if input is empty or not a string
        if (!html || typeof html !== 'string') {
            return new HtmlDocument(null)
        }

        // An invisible root element that holds all top tags
        const root = new HtmlElement('root')

        // Stack to keep track of which parent tag we are currently inside
        // The top item is always the current parent.
        const stack = [root]

        let cursor = 0

        // Main loop: go through the whole HTML string
        while (cursor < html.length) {
            if (html[cursor] === '<') {
                const tagEndIndex = html.indexOf('>', cursor)

                if (tagEndIndex === -1) {
                    break
                }

                const rawTagContent = html.slice(cursor + 1, tagEndIndex).trim()

                this.#processTag(rawTagContent, stack)

                cursor = tagEndIndex + 1
            } else {
                const nextTagIndex = html.indexOf('<', cursor)

                let text = ''
                if (nextTagIndex === -1) {
                    text = html.slice(cursor)
                    cursor = html.length
                } else {
                    text = html.slice(cursor, nextTagIndex)
                    cursor = nextTagIndex
                }

                this.#processText(text, stack)
            }
        }

        const primaryElement = root.children.length === 1 ? root.children[0] : root
        return new HtmlDocument(primaryElement)
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
        // Check if the tag ends with "/" (for example <img src="example.jpg" />)
        const isExplicitSelfClosing = rawTagContent.endsWith('/')
        const cleanTag = isExplicitSelfClosing ? rawTagContent.slice(0, -1).trim() : rawTagContent

        // Get the tag name (everything before the first space)
        const firstSpaceIndex = cleanTag.indexOf(' ')
        let tagName = ''
        let attributeString = ''

        if (firstSpaceIndex === -1) {
            tagName = cleanTag
        } else {
            tagName = cleanTag.slice(0, firstSpaceIndex)
            attributeString = cleanTag.slice(firstSpaceIndex + 1).trim()
        }

        // Create the new element
        const newElement = new HtmlElement(tagName)

        // Read attributes if there are any
        if (attributeString.length > 0) {
            this.#parseAttributes(attributeString, newElement)
        }

        // Add this new element as a child to the current parent
        const currentParent = stack[stack.length - 1]
        currentParent.addChild(newElement)

        // Put it on the stack if it expects a closing tag
        const isVoidTag = this.#voidTags.includes(newElement.tagName)
        if (!isExplicitSelfClosing && !isVoidTag) {
            stack.push(newElement)
        }
    }

    /**
     * Reads attributes like `id="test" class="btn"` and saves them to the element.
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
