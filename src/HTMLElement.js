/**
 * HtmlElement represents a single HTML tag in the document tree.
 * Single Responsibility: Store data for one tag and its children.
 */
export class HtmlElement {
    /**
     * Creates a new HTML element.
     * @param {string} tagName - Tag name
     */
    constructor(tagName) {
        // Store tag name in lowercase to make comparisons easier
        this.tagName = tagName.toLowerCase()

        // Object with key-value pairs for attributes (for example id: "main" and class: "btn" )
        this.attributes = {}

        this.children = []

        this.textContent = ''

        this.parent = null
    }

    /**
     * Adds a child element to this element.
     * @param {HtmlElement} childElement - The element to add.
     */
    addChild(childElement) {
        // Set this element as the parent of the child
        childElement.parent = this
        this.children.push(childElement)
    }

    /**
     * Sets an attribute on the element
     * @param {string} name - Attribute name
     * @param {string} value - Attribute value
     */
    setAttribute(name, value) {
        this.attributes[name.toLowerCase()] = value
    }

    /**
     * Gets an attribute value, or null if it does not exist.
     * @param {string} name - Attribute name.
     * @returns {string|null}
     */
    getAttribute(name) {
        const key = name.toLowerCase()
        return this.attributes[key] !== undefined ? this.attributes[key] : null
    }

    /**
     * Checks if the element has a specific attribute.
     * @param {string} name - Attribute name.
     * @returns {boolean}
     */
    hasAttribute(name) {
        return this.getAttribute(name) !== null
    }

    /**
     * Gets all text from this element and all its children.
     * @returns {string}
     */
    getTextContent() {
        const parts = []

        if (this.textContent) {
            parts.push(this.textContent)
        }

        for (const child of this.children) {
            const childText = child.getTextContent()
            if (childText.length > 0) {
                parts.push(childText)
            }
        }

        return parts.join(' ').trim()
    }


    /**
     * Finds an element with a specific ID.
     * @param {string} id - The ID to look for.
     * @returns {HtmlElement|null}
     */
    getElementById(id) {
        if (this.getAttribute('id') === id) {
            return this
        }

        // Ask all children
        for (const child of this.children) {
            const match = child.getElementById(id)
            if (match !== null) {
                return match
            }
        }

        return null
    }

    /**
     * Finds all elements with a specific tag name.
     * @param {string} tagName - example "p" or "a" tag elements
     * @returns {HtmlElement[]}
     */
    getElementsByTagName(tagName) {
        const results = []
        const targetTag = tagName.toLowerCase()

        // Check if this element matches
        if (this.tagName === targetTag) {
            results.push(this)
        }

        // Search through all children
        for (const child of this.children) {
            const childMatches = child.getElementsByTagName(targetTag)
            results.push(...childMatches)
        }

        return results
    }

    /**
     * Finds all elements that have a specific CSS class.
     * @param {string} className - Class name to search for.
     * @returns {HtmlElement[]}
     */
    getElementsByClassName(className) {
        const results = []
        const classAttribute = this.getAttribute('class')

        if (classAttribute !== null) {
            // Tags can have multiple classes: class="card active large"
            const classes = classAttribute.split(' ')
            if (classes.includes(className)) {
                results.push(this)
            }
        }

        for (const child of this.children) {
            const childMatches = child.getElementsByClassName(className)
            results.push(...childMatches)
        }

        return results
    }
}
