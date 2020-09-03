class PlutoComponent {
    constructor(name, data) {
        this.element = null;
        if (typeof name !== "object") {
            window.PlutoComponents = (window.PlutoComponents) ? window.PlutoComponents : {};
            window.PlutoComponents[name] = this;
            this.name = name;
            this.dataDefault = data;
        } else {
            this.dataDefault = name;
        }
        this.onCreate();
    }
    calcDiff(o1, o2) {
        var k, kDiff,
            diff = {};
        for (k in o1) {
            if (!o1.hasOwnProperty(k)) {} else if (typeof o1[k] != 'object' || typeof o2[k] != 'object') {
                if (!(k in o2) || o1[k] !== o2[k]) {
                    diff[k] = o2[k];
                }
            } else if (kDiff = this.calcDiff(o1[k], o2[k])) {
                diff[k] = kDiff;
            }
        }
        for (k in o2) {
            if (o2.hasOwnProperty(k) && !(k in o1)) {
                diff[k] = o2[k];
            }
        }
        for (k in diff) {
            if (diff.hasOwnProperty(k)) {
                return diff;
            }
        }
        return false;
    }

    set data(data) {
        var dataDiff;
        if (Array.isArray(this.dataDefault) || Array.isArray(data)) {
            dataDiff = this.calcDiff(this.dataDefault, data);
            this.dataDefault = data;
        } else {
            dataDiff = this.calcDiff(this.dataDefault, data);
            this.dataDefault = Object.assign(this.dataDefault, data);
        }
        if (this.mounted && dataDiff) {
            this.dataDiff = Object.values(dataDiff);
            this.onDataChange();
        }
        return this;
    }

    pushData(data) {
        if (!Array.isArray(this.dataDefault)) {
            return;
        }
        var oldData = [...this.dataDefault];
        this.dataDefault.push(data);
        var dataDiff = this.calcDiff(oldData, this.dataDefault);
        if (this.mounted && dataDiff) {
            this.dataDiff = Object.values(dataDiff);
            this.onDataPush();
        }
        return this;
    }
    get data() {
        return this.dataDefault;
    }
    onDataPush() {

    }
    onDataChange() {
        this.element.replace(this._render().element)
    }
    onCreate() {

    }
    onMount() {

    }
    _render() {
        this.element = this.render();
        this.mounted = true;
        this.onMount();
        return this.element;
    }
    toString() {
        return this.render();
    }
}
window.PlutoImplements = [];
window.PlutoSupportedTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];
const Pluto = {
    query: (query) => {
        var query = (typeof query === "string") ? document.querySelector(query) : (query.nodeType && query.nodeType === Node.ELEMENT_NODE) ? query : (query instanceof Pluto) ? query.element : null;
        return new PlutoElement(query);
    },
    jsonHighlight: (json) => {
        json = Pluto.jsonPretty(json).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var style = 'color:darkorange;';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    style = 'color:red;';
                } else {
                    style = 'color:green;';
                }
            } else if (/true|false/.test(match)) {
                style = 'color:blue;';
            } else if (/null/.test(match)) {
                style = 'color:magenta;';
            }
            return '<span style="' + style + '">' + match + '</span>';
        });
    },
    jsonPretty: (json) => {
        return JSON.stringify(json, undefined, 4);
    },
    assign: (name) => {
        window.PlutoSupportedTags.push(name);
        Pluto[name] = new PlutoElement(name);
        return Pluto[name];
    },
    implement: (name, props) => {
        PlutoImplements[name] = props;
    }
}
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
     * @param {object} props Example: {innerText:"Example",href:"localhost"}
     * @param {string} props Example: ("innerText","Example")
     * @returns {PlutoElement}
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
     * @param {...name} name Example: ("class1","class2"...)
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
        return this;
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
    /**
     * @param {PlutoElement} elements Example: (Pluto.div)
     * @param {PlutoComponent} elements Example: ({props:{name:"CompName",data:[1,2,3]}},component)
     * @returns {PlutoElement} Parent Element
     */
    child(...elements) {
        elements = this.beforeRender(elements).map(x => x.element);
        try {
            this.element.append(...elements);
        } catch (error) {
            console.error(error)
        }
        return this;
    }
    /**
     * @param {PlutoElement} elements Example: (Pluto.div)
     * @param {PlutoComponent} elements Example: ({props:{name:"CompName",data:[1,2,3]}},component)
     * @returns {PlutoElement} Parent Element
     */
    prepend(...elements) {
        elements = this.beforeRender(elements).map(x => x.element);
        try {
            this.element.prepend(...elements);
        } catch (error) {
            console.error(error)
        }
        return this;
    }
    /**
     * @description Prevents container element from emptying before creating. Used before .render()
     */
    noClear() {
        this.noClearChilds = true;
        return this;
    }
    /**
     * @param {PlutoElement} elements Example: (Pluto.div)
     * @param {PlutoComponent} elements Example: ({props:{name:"CompName",data:[1,2,3]}},component)
     * @returns {PlutoElement} Container Element
     */
    render(...elements) {
        if (!this.noClearChilds) {
            this.element.innerHTML = '';
            this.noClearChilds = false;
        }
        this.child(...elements);
        return this;
    }
    renderTo(selector) {
        var parent = Pluto.query(selector);
        if (!this.noClearChilds) {
            parent.element.innerHTML = '';
            this.noClearChilds = false;
        }
        parent.child(this);
        return this;
    }
    /**
     * @param {string} text
     * @returns {PlutoElement}
     * @returns {innerText}
     * @description Returns the innerText value of the element if the parameter is not defined
     */
    text(text) {
        if (text) {
            this.element.innerText = text;
        } else {
            return this.element.innerText;
        }
        return this;
    }
    value(text) {
        if (text) {
            this.element.value = text;
        } else {
            return this.element.value;
        }
        return this;
    }
    show() {
        this.element.style.display = 'block';
        return this;
    }
    hide() {
        this.element.style.display = 'none';
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
    /**
     * @param {string} text
     * @returns {PlutoElement}
     * @returns {innerHTML}
     * @description Returns the innerHTML value of the element if the parameter is not defined
     */
    html(html) {
        if (html) {
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
            this.element[ev]();
        }
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