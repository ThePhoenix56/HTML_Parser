/**
 * HtmlDocument represents the whole parsed HTML document.
 * Single Responsibility: Provide simple methods to search through the document.
 */
export class HtmlDocument {
    /**
     * @param {HtmlElement} rootElement - The top root element of the tree.
     */
    constructor(rootElement) {
        this.root = rootElement
    }

    /**
     * Finds an element by its ID.
     * @param {string} id - The element ID.
     * @returns {HtmlElement|null}
     */
    getElementById(id) {
        if (!this.root) return null
        return this.root.getElementById(id)
    }

    /**
     * Finds all elements with a specific tag name.
     * @param {string} tagName - Tag name
     * @returns {HtmlElement[]}
     */
    getElementsByTagName(tagName) {
        if (!this.root) return []
        return this.root.getElementsByTagName(tagName)
    }

    /**
     * Finds all elements that have a specific class name.
     * @param {string} className - Class name.
     * @returns {HtmlElement[]}
     */
    getElementsByClassName(className) {
        if (!this.root) return []
        return this.root.getElementsByClassName(className)
    }

    /**
     * Gets all text from the whole document.
     * @returns {string}
     */
    getTextContent() {
        if (!this.root) return ''
        return this.root.getTextContent()
    }
}
