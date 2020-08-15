export default class PlutoComponent {
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