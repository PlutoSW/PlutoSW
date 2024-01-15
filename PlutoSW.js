"use strict";
window.PlutoComponents = {};
window.PlutoDataSet = new Set();
class PlutoComponent extends HTMLElement {
    constructor(props = {}) {
        super(props);
        this.PlutoSW = {};
        if (typeof props == "string") {
            this.CompName = props;
            window.PlutoComponents[props] = this;
        } else if (props?.name) {
            this.CompName = props.name;
            window.PlutoComponents[props.name] = this;
            delete props.name;
            for (const prop in props) {
                if (Object.hasOwnProperty.call(props, prop)) {
                    this[prop] = props[prop];
                }
            }
        }

        Object.defineProperty(this, "render", {
            value: (...child) => {
                child = this.beforeRender(child);
                if (child) {
                    this.innerHTML = "";
                    if (typeof child[0] == "function") {
                        var els = child[0](this);
                        this.append(els);
                    } else {
                        this.append(...child);
                    }
                }
                return this;
            },
            writable: false,
            configurable: false,
        });
    }
    class(...clas) {
        this.classList.add(...clas);
        return this;
    }
    wrap(parent) {
        if (parent instanceof PlutoElement) {
            parent.child(this);
        } else {
            parent.append(this);
        }
        return parent;
    }
    removeClass(...clas) {
        this.classList.remove(clas);
        return this;
    }
    before(...elements) {
        elements = this.beforeRender(elements);
        try {
            this.parentNode.insertBefore(elements[0], this);
        } catch (error) {
            console.error(error);
        }
        return this;
    }
    after(...elements) {
        elements = this.beforeRender(elements);
        try {
            this.parentNode.insertBefore(elements[0], this.nextSibling);
        } catch (error) {
            console.error(error);
        }
        return this;
    }
    /**
     * @param {object} css Example: {color:"red",fontWeight:"bold"}
     * @param {object} css Example: ("color","red") or get style ("color")
     */
    css(...css) {
        if (typeof css[0] === "string") {
            if (css[1]) {
                this.style[css[0]] = css[1];
                return this;
            } else {
                return this.style[css[0]];
            }
        }
        css = css[0];
        for (let r in css) {
            this.style[r] = typeof css[r] === "number" ? css[r] + "px" : css[r];
        }
        return this;
    }
    beforeRender(elements) {
        var tempElem = [];
        elements.forEach((elem) => {
            if (elem) {
                if (elem instanceof PlutoElement) {
                    tempElem.push(elem.element);
                    elem.element.PlutoParent = this;
                } else {
                    tempElem.push(elem);
                }
            }
        });
        return tempElem;
    }
    /**
     * @param {object} props Example: {id:"Example",project:"localhost"}
     *  @param {string} props Example: ("id","Example")
     */
    data(...props) {
        if (!props.length) {
            return this.PlutoSW;
        }

        PlutoDataSet.add(this);
        if (props[0] === null) {
            this.PlutoSW = {};
            return this;
        }
        if(props[0] === null){
            this.PlutoSW = {};
            return this;
        }
        if (typeof props[0] === "string") {
            if (props[1]) {
                this.PlutoSW[props[0]] = props[1];
                return this;
            } else {
                return this.PlutoSW[props[0]];
            }
        }

        if (typeof props[0] === "object") {
            this.PlutoSW = {
                ...this.PlutoSW,
                ...props[0]
            }
        }

        return this;
    }
    connectedCallback() {
        if (this.state) {
            this.state = deepObserve(this.state, (a, b, c) => this.onState(a, b, c));
        }
        this?.onConnect?.();
    }
    disconnectedCallback() {
        this?.onDisconnect?.();
    }
    _onState(name, old, ne) {
        this?.onState?.(name, old, ne);
    }
    _onIsolatedState(name, old, ne) {
        this?.onIsolatedState?.(name, old, ne);
    }
    parent() {
        return this.PlutoParent;
    }
    child(...child) {
        child = this.beforeRender(child);
        if (child) {
            if (typeof child[0] == "function") {
                var els = child[0](this);
                this.append(els);
            } else {
                this.append(...child);
            }
        }
        return this;
    }
    /**
     * @param {...name} attrs Example: ("src","href"...)
     */
    removeAttr(...attrs) {
        if (attrs) {
            this.removeAttribute(...attrs);
            return this;
        }
    }
    /**
     * @param {object} attrs Example: {title:"Example",href:"localhost"}
     * @param {string} attrs Example: ("title","Example")
     */
    attr(...attrs) {
        attrs = [...attrs.filter(Boolean)];
        if (typeof attrs[0] === "string") {
            if (attrs[1]) {
                this.setAttribute(attrs[0], attrs[1]);
                return this;
            } else {
                return this.getAttribute(attrs[0]);
            }
        }
        attrs = attrs[0];
        for (let r in attrs) {
            var rattrs = attrs[r];
            if (typeof rattrs === "object") {
                var attrData = "";
                for (let t in rattrs) {
                    attrData += `${t}:${rattrs[t]};`;
                }
                this.setAttribute(r, attrData);
            } else {
                this.setAttribute(r, rattrs);
            }
        }
        return this;
    }
    id(value) {
        if (value) {
            this.setAttribute("id", value);
            return this;
        } else {
            return this.getAttribute("id");
        }
    }
    assign(name, scope = window) {
        scope[name] = this;
        return this;
    }
    destroy() {
        delete window.PlutoComponents[this.CompName];
        this.remove();
    }
    on(ev, fn) {
        if (!fn) {
            this.dispatchEvent(new Event(ev));
            return this;
        }
        if (typeof ev == "string") {
            this.addEventListener(ev, fn);
        } else if (typeof ev == "object") {
            Object.keys(ev).forEach((event) => {
                this.addEventListener(event, ev[event]);
            });
        }
        return this;
    }
    off(ev, fn) {
        if (typeof ev == "string") {
            this.removeEventListener(ev, fn)
        } else {
            Object.keys(ev).forEach((evs) => {
                this.removeEventListener(evs, ev[evs]);
            });
        }
        return this;
    }
    setState(state) {
        if (state) {
            this.state = deepObserve(state, (a, b, c) => this._onState(a, b, c));
            this._onState("setState", null, state);
        }
        return this;
    }
    setIsolatedState(state) {
        if (state) {
            this.isolatedState = deepObserve(state, (a, b, c) => this._onIsolatedState(a, b, c));
        }
        return this;
    }
}
window.PlutoImplements = [];
window.PlutoNSSupport = [
    ["svg", "http://www.w3.org/2000/svg"],
    ["circle", "http://www.w3.org/2000/svg"],
    ["rect", "http://www.w3.org/2000/svg"],
    ["path", "http://www.w3.org/2000/svg"],
    ["marker", "http://www.w3.org/2000/svg"],
    ["linearGradient", "http://www.w3.org/2000/svg"],
    ["radialGradient", "http://www.w3.org/2000/svg"],
    ["animate", "http://www.w3.org/2000/svg"],
    ["animateTransform", "http://www.w3.org/2000/svg"],
    ["clipPath", "http://www.w3.org/2000/svg"],
    ["mask", "http://www.w3.org/2000/svg"],
    ["pattern", "http://www.w3.org/2000/svg"],
    ["defs", "http://www.w3.org/2000/svg"],
    ["g", "http://www.w3.org/2000/svg"],
    ["textPath", "http://www.w3.org/2000/svg"],
    ["switch", "http://www.w3.org/2000/svg"],
    ["text", "http://www.w3.org/2000/svg"],
];
window.PlutoSupportedTags = [
    "a",
    "abbr",
    "acronym",
    "address",
    "applet",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "basefont",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "meta",
    "meter",
    "nav",
    "noframes",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "tt",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
];
const Pluto = {
    query: (query, scope = document) => {
        if (!query) return new PlutoElement("body");

        if (typeof query === "string") {
            if (scope instanceof PlutoElement) {
                scope = scope.element;
            }
            query = scope.querySelector(query);
        }
        if (query?.nodeType && query?.nodeType === Node.ELEMENT_NODE) {
            query = query;
        }
        if (query instanceof PlutoElement) {
            query = query.element;
        }
        if (!query) {
            return null;
        }
        return new PlutoElement(query);
    },
    queryData(data, value, scope = "body") {
        return PlutoDataSet.filter((a) => a.closest(scope) && a.PlutoSW[data] == value);
    },
    jsonHighlight: (json, colorOptions = {}) => {
        const entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "`": "&#x60;",
            "=": "&#x3D;",
        };
        function escapeHtml(html) {
            return String(html).replace(/[&<>"'`=]/g, function (s) {
                return entityMap[s];
            });
        }
        let colors = Object.assign(
            {},
            {
                keyColor: "#99d9fa",
                numberColor: "#b4cda7",
                stringColor: "#cb8f77",
                trueColor: "#569cd6",
                falseColor: "#569cd6",
                nullColor: "#569cd6",
            },
            colorOptions,
        );
        json = Pluto.jsonPretty(json)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        let replaced = json.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g,
            (match) => {
                let color = colors.numberColor;
                let style = "";
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        color = colors.keyColor;
                    } else {
                        color = colors.stringColor;
                        match = '"' + escapeHtml(match.substr(1, match.length - 2)) + '"';
                        style = "word-wrap:break-word;white-space:pre-wrap;";
                    }
                } else {
                    color = /true/.test(match)
                        ? colors.trueColor
                        : /false/.test(match)
                            ? colors.falseColor
                            : /null/.test(match)
                                ? colors.nullColor
                                : color;
                }
                return `<span style="${style}color:${color}">${match}</span>`;
            },
        );
        return Pluto.pre
            .css({
                background: "#1e1e1e",
                color: "#1880ca",
                padding: "10px",
            })
            .child(Pluto.code.html(replaced));
    },
    diff: (o1, o2) => {
        var k,
            kDiff,
            diff = {};
        for (k in o1) {
            if (!o1.hasOwnProperty(k)) {
            } else if (typeof o1[k] != "object" || typeof o2[k] != "object") {
                if (!(k in o2) || o1[k] !== o2[k]) {
                    if (typeof o2[k] !== "undefined") {
                        diff[k] = o2[k];
                    }
                }
            } else if ((kDiff = Pluto.diff(o1[k], o2[k]))) {
                if (typeof kDiff !== "undefined") {
                    diff[k] = kDiff;
                }
            }
        }
        for (k in o2) {
            if (o2.hasOwnProperty(k) && !(k in o1)) {
                if (typeof o2[k] !== "undefined") {
                    diff[k] = o2[k];
                }
            }
        }
        for (k in diff) {
            if (diff.hasOwnProperty(k)) {
                return diff;
            }
        }
        return false;
    },
    uuidv4: (str) => {
        if (str) {
            return str.slugify();
        }
        return (
            str ||
            "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c == "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            })
        );
    },
    jsonPretty: (json) => {
        return JSON.stringify(json, undefined, 4);
    },
    text: (text) => {
        return new PlutoElement(text);
    },
    assign: (name, global = false, as) => {
        if (typeof global === "function") {
            name = name.search("-") > -1 ? name : "pluto-" + name;
            customElements.define(name, global, as);
        }
        window.PlutoSupportedTags.push(name);
        if (!global) {
            Pluto[name] = new PlutoElement(name);
            return Pluto[name];
        } else {
            Object.defineProperty(Pluto, name, {
                get() {
                    return new PlutoElement(name);
                },
            });
        }
        return Pluto;
    },
    implement: (name, props) => {
        PlutoImplements[name] = props;
    },
    extend: (name, fn) => {
        PlutoElement.prototype[name] = fn;
    },
    component: (name) => {
        return window.PlutoComponents[name];
    },
    components: (query) => {
        if (query) {
            let comps = Object.values(window.PlutoComponents);
            return comps.filter((a) => query(a));
        }
        return window.PlutoComponents;
    },
};
JSON.highlight = Pluto.jsonHighlight;
JSON.pretty = Pluto.jsonPretty;

window.PlutoSupportedTags.forEach((e) => {
    Object.defineProperty(Pluto, e, {
        get() {
            return new PlutoElement(e);
        },
    });
});

window.PlutoNSSupport.forEach((e) => {
    let [name, ns] = e;
    Object.defineProperty(Pluto, name, {
        get() {
            return new PlutoElement(name, ns);
        },
    });
});
function isHtmlElement(element) {
    return window.PlutoSupportedTags.includes(element) ||
        window.PlutoNSSupport.map((a) => a[0]).includes(element)
}
class PlutoElement {
    constructor(element, ns = null) {
        var temp;
        switch (typeof element) {
            case "string":
                if (isHtmlElement(element)) {
                    if (ns) {
                        temp = document.createElementNS(ns, element);
                    } else {
                        temp = document.createElement(element);
                    }
                } else {
                    temp = document.createRange().createContextualFragment(element).firstChild;
                }
                break;
            case "object":
                if (element.nodeType && element.nodeType === Node.ELEMENT_NODE) {
                    temp = element;
                } else if (element instanceof PlutoElement) {
                    temp = element.current;
                }
                break;
        }
        if (!temp?.PlutoSW) {
            temp["PlutoSW"] = {};
        }
        this.element = temp;
        if (isHtmlElement(element) && PlutoImplements[element]) {
            if (PlutoImplements[element].events) {
                Object.keys(PlutoImplements[element].events).forEach((event) => {
                    this.element.addEventListener(event, PlutoImplements[element].events[event]);
                });
            }
            if (PlutoImplements[element].props) {
                this.props(PlutoImplements[element].props);
            }
            if (PlutoImplements[element].attrs) {
                this.attr(PlutoImplements[element].attrs);
            }
        }
        var observer = new MutationObserver((mutations, me) => {
            if (document.contains(this.element)) {
                this?.onConnect?.(this.element);
                me.disconnect();
                return;
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    }
    beforeRender(elements) {
        var tempElem = [];
        elements.forEach((elem) => {
            if (elem) {
                if (elem instanceof PlutoElement) {
                    elem.element.PlutoParent = this;
                    tempElem.push(elem.element);
                } else {
                    if (elem.nodeType && elem.nodeType === Node.ELEMENT_NODE) {
                        elem.PlutoParent = this;
                    }
                    tempElem.push(elem);
                }
            }
        });
        return tempElem;
    }
    /**
     * @param {object} props Example: {innerText:"Example",href:"localhost"}
     * @param {string} props Example: ("innerText","Example")
     * @returns {PlutoElement}
     */
    props(...props) {
        props = [...props.filter(Boolean)];
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
     * @param {...name} attrs Example: ("src","href"...)
     */
    removeAttr(...attrs) {
        if (attrs) {
            this.element.removeAttribute(...attrs);
            return this;
        }
    }
    /**
     * @param {object} attrs Example: {title:"Example",href:"localhost"}
     * @param {string} attrs Example: ("title","Example")
     */
    attr(...attrs) {
        attrs = [...attrs.filter(Boolean)];
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
            var rattrs = attrs[r];
            if (typeof rattrs === "object") {
                var attrData = "";
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
     * @param {...name} name Example: ("class1","class2"...)
     */
    class(...name) {
        if (name) {
            this.element.classList.add(...name.filter(Boolean));
            return this;
        } else {
            return this.element.classList.toString();
        }
    }
    /**
     * @param {...name} name Example: ("class1","class2"...)
     */
    toggleClass(...name) {
        if (name) {
            this.element.classList.toggle(...name);
            return this;
        }
    }
    /**
     * @param {...name} name Example: ("class1","class2"...)
     */
    removeClass(...name) {
        if (name) {
            this.element.classList.remove(...name);
            return this;
        }
    }
    /**
     * @param {...name} name Example: "class1"
     */
    hasClass(name) {
        if (name) {
            return this.element.classList.contains(name);
        }
        return false;
    }
    remove() {
        this.element.remove();
        return null;
    }
    /**
     * @param {object} css Example: {color:"red",fontWeight:"bold"}
     * @param {object} css Example: ("color","red") or get style ("color")
     */
    css(...css) {
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
     * @param {PlutoElement} elements Example: (Pluto.div)
     * @param {PlutoComponent} elements Example: ({props:{name:"CompName",data:[1,2,3]}},component)
     * @returns {PlutoElement} Parent Element
     */
    child(...elements) {
        elements = this.beforeRender(elements);

        try {
            this.element.append(...elements);
        } catch (error) {
            console.error(error);
        }
        return this;
    }
    render(...elements) {
        elements = this.beforeRender(elements);
        try {
            this.element.innerHTML = "";
            this.element.append(...elements);
        } catch (error) {
            console.error(error);
        }
        return this;
    }
    children(index) {
        if (typeof index != "undefined") {
            return new PlutoElement(this.element.children[index]);
        }
        return [...this.element.children].map((a) => new PlutoElement(a));
    }
    index() {
        return [...this.element.parentNode.children].indexOf(this.element);
    }
    /**
     * @param {PlutoElement} elements Example: (Pluto.div)
     * @param {PlutoComponent} elements Example: ({props:{name:"CompName",data:[1,2,3]}},component)
     * @returns {PlutoElement} Parent Element
     */
    prepend(...elements) {
        elements = this.beforeRender(elements);
        try {
            this.element.prepend(...elements);
        } catch (error) {
            console.error(error);
        }
        return this;
    }
    before(...elements) {
        elements = this.beforeRender(elements);
        try {
            this.element.parentNode.insertBefore(elements[0], this.element);
        } catch (error) {
            console.error(error);
        }
        return this;
    }
    parent() {
        return this.element.PlutoParent
            ? this.element.PlutoParent
            : new PlutoElement(this.element.parentNode);
    }
    parents(selector) {
        const parents = [];
        let el = this.element;
        while ((this.element = this.element.parentNode) && this.element !== document) {
            if (!selector || this.element.matches(selector)) parents.push(this.element);
        }
        return parents?.[0];
    }
    after(...elements) {
        elements = this.beforeRender(elements);
        try {
            this.element.parentNode.insertBefore(elements[0], this.element.nextSibling);
        } catch (error) {
            console.error(error);
        }
        return this;
    }
    prev() {
        return this.element?.previousElementSibling
            ? new PlutoElement(this.element.previousElementSibling)
            : null;
    }
    next() {
        return this.element?.nextElementSibling
            ? new PlutoElement(this.element.nextElementSibling)
            : null;
    }
    /**
     * @param {string} text
     * @returns {PlutoElement}
     * @returns {innerText}
     * @description Returns the innerText value of the element if the parameter is not defined
     */
    text(text) {
        if (typeof text !== "undefined") {
            this.element.innerText = text;
        } else {
            return this.element.innerText;
        }
        return this;
    }
    value(text) {
        if (typeof text !== "undefined") {
            this.element.value = text;
        } else {
            return this.element.value;
        }
        return this;
    }
    href(href) {
        if (typeof href !== "undefined") {
            this.attr("href", href);
            return this;
        } else {
            return this.attr("href");
        }
    }
    src(src) {
        if (typeof src !== "undefined") {
            this.attr("src", src);
            return this;
        } else {
            return this.attr("src");
        }
    }
    show() {
        this.element.style.display = "block";
        return this;
    }
    hide() {
        this.element.style.display = "none";
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
        this.element.replaceWith(element.element);
        this.element = element.element;
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
    /**
     * @param {string} text
     * @returns {PlutoElement}
     * @returns {innerHTML}
     * @description Returns the innerHTML value of the element if the parameter is not defined
     */
    html(html) {
        if (typeof html !== "undefined") {
            this.element.innerHTML = html;
        } else {
            return this.element.innerHTML;
        }
        return this;
    }
    /**
     * @param {object} props Example: {id:"Example",project:"localhost"}
     *  @param {string} props Example: ("id","Example")
     */
    data(...props) {
        if (!props.length) {
            return this.element.PlutoSW;
        }
        PlutoDataSet.add(this.element);
        if (props[0] === null) {
            this.element.PlutoSW = {};
            return this;
        }
        if (typeof props[0] === "string") {
            if (props[1]) {
                this.element.PlutoSW[props[0]] = props[1];
                return this;
            } else {
                return this.element.PlutoSW[props[0]];
            }
        }
        if (typeof props[0] === "object") {
            this.element.PlutoSW = {
                ...this.element.PlutoSW,
                ...props[0]
            }
        }

        return this;
    }
    on(ev, fn) {
        if (!fn) {
            this.element.dispatchEvent(new Event(ev));
            return this;
        }
        if (typeof ev == "string") {
            this.element.addEventListener(ev, fn);
        } else if (typeof ev == "object") {
            Object.keys(ev).forEach((event) => {
                this.element.addEventListener(event, ev[event]);
            });
        }
        return this;
    }
    off(ev, fn) {
        if (typeof ev == "string") {
            this.element.removeEventListener(ev, fn);
        } else {
            Object.keys(ev).forEach((event) => {
                this.element.removeEventListener(event, ev[event]);
            });
        }
        return this;
    }
    trigger(event) {
        this.element.dispatchEvent(new Event(event));
        return this;
    }
    toString() {
        return this.element.outerHTML;
    }
}

const arrayChangeMethod = ["push", "pop", "unshift", "shift", "splice", "sort", "reverse"];
const { getOwnPropertyNames, getOwnPropertySymbols, defineProperty, getOwnPropertyDescriptor } =
    Object;

function isObject(obj) {
    return typeof obj === "object";
}

function isArray(arr) {
    return Array.isArray(arr);
}

function isFunction(fn) {
    return typeof fn === "function";
}
const getOwnKeys = isFunction(getOwnPropertySymbols)
    ? function (obj) {
        if (obj === null) {
            obj = {};
        }
        return getOwnPropertyNames(obj).concat(getOwnPropertySymbols(obj));
    }
    : getOwnPropertyNames;
function deepObserve(obj, hook) {
    const mapStore = {};
    let arrayChanging = false;

    function wrapProperty(key) {
        let value = obj[key];
        const desc = getOwnPropertyDescriptor(obj, key);
        if (desc && desc.configurable === false) return;
        defineProperty(obj, key, {
            get() {
                if (mapStore[key]) return value;
                if (isObject(value) || isArray(value)) {
                    deepObserve(value, hook);
                }
                mapStore[key] = true;
                return value;
            },
            set(val) {
                if (val instanceof PlutoElement === false && (isObject(val) || isArray(val)))
                    deepObserve(val, hook);
                mapStore[key] = true;
                const old = value;
                value = val;
                if (!arrayChanging) hook(key, old, val);
                return val;
            },
            enumerable: desc.enumerable,
            configurable: true,
        });
    }
    if (isObject(obj) || isArray(obj)) {
        getOwnKeys(obj).forEach((key) => wrapProperty(key));
    }
    if (isArray(obj)) {
        arrayChangeMethod.forEach((key) => {
            const originFn = obj[key];
            defineProperty(obj, key, {
                value(...args) {
                    const origin = obj.slice();
                    const originLength = obj.length;
                    arrayChanging = true;
                    originFn.bind(obj)(...args);
                    arrayChanging = false;
                    if (obj.length > originLength) {
                        const keys = new Array(obj.length - originLength)
                            .fill(1)
                            .map((value, index) => (index + originLength).toString());
                        keys.forEach((key) => wrapProperty(key));
                    }
                    hook(key, origin, obj);
                },
                enumerable: false,
                configurable: true,
                writable: true,
            });
        });
    }
    return obj;
}
export { Pluto, PlutoComponent, PlutoElement };
