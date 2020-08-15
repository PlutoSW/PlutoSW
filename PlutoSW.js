import PlutoComponent from './PlutoComponent.js';
window.PlutoSupportedTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];
const Pluto = {
    query: (query) => {
        var query = (typeof query === "string") ? document.querySelector(query) : (query.nodeType && query.nodeType === Node.ELEMENT_NODE) ? query : (query instanceof Pluto) ? query.element : null;
        return new PlutoElement(query);
    }
}
window.PlutoSupportedTags.forEach(e => {
    Object.defineProperty(Pluto, e, {
        get() {
            return new PlutoElement(e);
        }
    });
})

class PlutoElement {
    constructor(element) {
        var temp;
        this.components = [];
        switch (typeof element) {
            case "string":
                if (window.PlutoSupportedTags.includes(element)) {
                    temp = document.createElement(element);
                } else {
                    temp = document.createRange().createContextualFragment(element).firstChild;
                }
                break;
            case "object":
                if (element.nodeType && element.nodeType === Node.ELEMENT_NODE) {
                    temp = element;
                } else if (element instanceof Pluto) {
                    temp = element.current;
                }
                break;
        }
        temp["PlutoSW"] = {};
        this.element = temp;
    }
    /**
     * @param {object||string} props Example: {innerText:"Example",href:"localhost"} or ("innerText","Example")
     */
    props(...props) {
        if (typeof props[0] === "string") {
            if (props[1]) {
                this.element[props[0]] = props[1];
                return this;
            } else {
                return this.element[props[0]];
            }
        }
        props = props[0];
        for (let r in props) {
            if (typeof props[r] === "object") {
                for (let t in props[r]) {
                    this.element[r][t] = props[r][t];
                }
            } else {
                this.element[r] = props[r];
            }
        }
        return this;
    }
    /**
     * @param {object||string} attrs Example: {href:"Example",src:"localhost"} or ("href","Example")
     */
    attr(...attrs) {
        if (typeof attrs[0] === "string") {
            if (attrs[1]) {
                this.element.setAttribute(attrs[0], attrs[1]);
                return this;
            } else {
                return this.element.getAttribute(attrs[0]);
            }
        }
        attrs = attrs[0];
        for (let r in attrs) {
            var rattrs = attrs[r]
            if (typeof rattrs === "object") {
                var attrData = '';
                for (let t in rattrs) {
                    attrData += `${t}:${rattrs[t]};`;
                }
                this.element.setAttribute(r, attrData);
            } else {
                this.element.setAttribute(r, rattrs);
            }
        }
        return this;
    }
    /**
     * @param {...name} attrs Example: ("class1","class2"...)
     */
    class(...name) {
        if (name) {
            this.element.classList.add(...name);
            return this;
        } else {
            return this.element.classList.toString();
        }
    }
    /**
     * @param {...name} attrs Example: ("class1","class2"...)
     */
    removeClass(...name) {
        if (name) {
            this.element.classList.remove(...name);
            return this;
        }
    }
    /**
     * @param {...name} attrs Example: "class1"
     */
    hasClass(name) {
        if (name) {
            return this.element.classList.contains(name);
        }
        return false;
    }
    /**
     * @param {object||string} css Example: {color:"red",fontWeight:"bold"} or ("color","red") or get style ("color")
     */
    style(...css) {
        if (typeof css[0] === "string") {
            if (css[1]) {
                this.element.style[css[0]] = css[1];
                return this;
            } else {
                return this.element.style[css[0]];
            }
        }
        css = css[0];
        for (let r in css) {
            this.element.style[r] = css[r];
        }
        return this;
    }
    /**
     * @param {PlutoElement|[]} elements Example: {innerText:"Example",href:"localhost"}
     */
    beforeRender(elements) {
        var tempElem = [];
        elements.forEach(elem => {
            if (elem instanceof PlutoElement) {
                tempElem.push(elem);
            } else {
                var component = new elem.component(elem.props);
                this.components.push(component);
                tempElem.push(component._render());
            }
        })
        return tempElem;
    }
    child(...elements) {
        elements = this.beforeRender(elements).map(x => x.element);
        try {
            this.element.append(...elements);
        } catch (error) {
            console.error(error)
        }
        return this;
    }
    noClear() {
        this.noClearChilds = true;
        return this;
    }
    render(...elements) {
        if (!this.noClearChilds) {
            this.element.innerHTML = '';
            this.noClearChilds = false;
        }
        this.child(...elements);
        return this;
    }
    text(text) {
        if (text) {
            this.element.innerText = text;
        } else {
            return this.element.innerText;
        }
        return this;
    }
    focus() {
        this.element.focus();
        return this;
    }
    focus() {
        this.element.focus();
        return this;
    }
    blur() {
        this.element.blur();
        return this;
    }
    replace(element) {
        this.element.replaceWith(element);
        return this;
    }
    id(id) {
        if (id) {
            this.element.id = id;
        } else {
            return this.element.id;
        }
        return this;
    }
    html(html) {
        if (html) {
            this.element.innerHTML = html;
        } else {
            return this.element.innerHTML;
        }
        return this;
    }
    /**
     * @param {object||string} props Example: {innerText:"Example",href:"localhost"} or ("innerText","Example")
     */
    data(...props) {
        if (!props.length) {
            return this.element.PlutoSW;
        }
        if (typeof props[0] === "string") {
            if (props[1]) {
                this.element.PlutoSW[props[0]] = props[1];
                return this;
            } else {
                return this.element.PlutoSW[props[0]];
            }
        }
        props = props[0];
        for (let r in props) {
            if (typeof props[r] === "object") {
                for (let t in props[r]) {
                    this.element.PlutoSW[r] = {};
                    this.element.PlutoSW[r][t] = props[r][t];
                }
            } else {
                this.element.PlutoSW[r] = props[r];
            }
        }
        return this;
    }
    on(ev, fn) {
        this.element.addEventListener(ev, fn.bind(event, this));
        return this;
    }
    toString() {
        return this.element.outerHTML;
    }
}
export {
    Pluto,
    PlutoComponent
};