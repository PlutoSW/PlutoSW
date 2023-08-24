"use strict";
window.PlutoComponents = [];
window.PlutoDataSet = [];
class PlutoComponent extends HTMLElement {
    constructor(props = {}) {
        super(props);
        if (props?.name) {
            this.CompName = props.name;
            window.PlutoComponents[props.name] = this;
        }
        for (const prop in props) {
            if (Object.hasOwnProperty.call(props, prop)) {
                this[prop] = props[prop];
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

    beforeRender(elements) {
        var tempElem = [];
        elements.forEach(elem => {
            if (elem) {
                if (elem instanceof PlutoElement) {
                    tempElem.push(elem.element);
                } else {
                    tempElem.push(elem);
                }
            }
        });
        return tempElem;
    }
    data(data) {
        if (typeof data == "object") {
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    this.dataset[key] = data[key];
                }
            }
        } else {
            console.error("data type must be Object");
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
    attr(key, value) {
        if (typeof value !== "undefined") {
            this.setAttribute(key, value);
            return this;
        } else {
            return this.getAttribute(key);
        }
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
    on(evs, func) {
        if (typeof evs == "string") {
            this.addEventListener(evs, e => {
                if (e.target === this) {
                    return func(e, this);
                }
            });
        } else {
            Object.keys(evs).forEach(event => {
                this.addEventListener(event, e => {
                    if (e.target === this) {
                        return evs[event](this, e);
                    }
                });
            });
        }
        return this;
    }
    setState(state) {
        if (state) {
            this.state = deepObserve(state, (a, b, c) => this._onState(a, b, c));
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
    "svg",
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
        var query = typeof query === "string" ? scope.querySelector(query) : query.nodeType && query.nodeType === Node.ELEMENT_NODE ? query : query instanceof Pluto ? query.element : null;
        return new PlutoElement(query);
    },
    queryData(data, value, scope = "body") {
        return PlutoDataSet.filter(a => a.closest(scope) && a.PlutoSW[data] == value);
    },
    jsonHighlight: json => {
        json = Pluto.jsonPretty(json).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var style = "color:darkorange;";
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    style = "color:red;";
                } else {
                    style = "color:green;";
                }
            } else if (/true|false/.test(match)) {
                style = "color:blue;";
            } else if (/null/.test(match)) {
                style = "color:magenta;";
            }
            return '<span style="' + style + '">' + match + "</span>";
        });
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
    uuidv4: () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    },
    jsonPretty: json => {
        return JSON.stringify(json, undefined, 4);
    },
    text: text => {
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
                    if (PlutoImplements[name]) {
                        var element = new PlutoElement(name);
                        return element.props(PlutoImplements[name]);
                    }
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
};
JSON.highlight = Pluto.jsonHighlight;
JSON.pretty = Pluto.jsonPretty;

window.PlutoSupportedTags.forEach(e => {
    Object.defineProperty(Pluto, e, {
        get() {
            if (PlutoImplements[e]) {
                var element = new PlutoElement(e);
                return element.props(PlutoImplements[e]);
            }
            return new PlutoElement(e);
        },
    });
});

class PlutoElement {
    constructor(element) {
        var temp;
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
                } else if (element instanceof PlutoElement) {
                    temp = element.current;
                }
                break;
        }
        temp["PlutoSW"] = {};
        this.element = temp;
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
        elements.forEach(elem => {
            if (elem) {
                if (elem instanceof PlutoElement) {
                    tempElem.push(elem.element);
                } else {
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
    children() {
        return [...this.element.children].map(a => new PlutoElement(a));
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
    parent(){
        return new PlutoElement(this.element.parentNode);
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
        return this.element?.previousElementSibling ? new PlutoElement(this.element.previousElementSibling) : null;
    }
    next() {
        return this.element?.nextElementSibling ? new PlutoElement(this.element.nextElementSibling) : null;
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
        PlutoDataSet.push(this.element);
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
        if (fn) {
            this.element.addEventListener(ev, fn.bind(event, this));
        } else {
            this.element.dispatchEvent(new Event(ev));
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
const { getOwnPropertyNames, getOwnPropertySymbols, defineProperty, getOwnPropertyDescriptor } = Object;

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
                if (val instanceof PlutoElement === false && (isObject(val) || isArray(val))) deepObserve(val, hook);
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
        getOwnKeys(obj).forEach(key => wrapProperty(key));
    }
    if (isArray(obj)) {
        arrayChangeMethod.forEach(key => {
            const originFn = obj[key];
            defineProperty(obj, key, {
                value(...args) {
                    const origin = obj.slice();
                    const originLength = obj.length;
                    arrayChanging = true;
                    originFn.bind(obj)(...args);
                    arrayChanging = false;
                    if (obj.length > originLength) {
                        const keys = new Array(obj.length - originLength).fill(1).map((value, index) => (index + originLength).toString());
                        keys.forEach(key => wrapProperty(key));
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
export { Pluto, PlutoElement, PlutoComponent };
