## PlutoSW DOM Manipulator and Component Manager


### Example
<div id="root"></div>
<script type="module">
    import {Pluto,PlutoComponent} from './PlutoSW.js';
    class ul extends PlutoComponent {
    constructor(props) {
        super(props.name, props.data);
    }
    onDataPush() {
        this.render(this.element, this.dataDiff);
    }
    render(target = Pluto.ul, data = this.data) {
        var elem = [];
        for (const d of data) {
            elem.push({
                component: li,
                props: d
            });
        }
        return target.child(...elem);
    }
}
class li extends PlutoComponent {
    constructor(data) {
        super(data);
        this.in = 0;
    }
    click() {
        this.element.attr('contenteditable', 'true').focus();
        document.execCommand('selectAll', false, null);
    }
    render() {
        return Pluto.li.props({
            innerText: this.data.key
        }).on("click", () => this.click()).on("blur", () => {
            this.data = {
                key: this.element.text()
            }
        });
    }
}


var ulcontainer = {
        component: ul,
        props: {
            name: "ul",
            data: [{
                "key": "li 1"
            }, {
                "key": "li 2"
            }]
        }
    },
    result = Pluto.div;
Pluto.query(document.getElementById("root")).render(
    ulcontainer,
    Pluto.button.text("ekle").on("click", () => {
        PlutoComponents.ul.pushData({
            "key": "li " + (PlutoComponents.ul.data.length + 1)
        });
    }),
    Pluto.button.text("getir").on("click", () => {
        result.text(JSON.stringify(PlutoComponents.ul.data));
    }),
    result
)
</script>
```javascript
class ul extends PlutoComponent {
    constructor(props) {
        super(props.name, props.data);
    }
    onDataPush() {
        this.render(this.element, this.dataDiff);
    }
    render(target = Pluto.ul, data = this.data) {
        var elem = [];
        for (const d of data) {
            elem.push({
                component: li,
                props: d
            });
        }
        return target.child(...elem);
    }
}
class li extends PlutoComponent {
    constructor(data) {
        super(data);
        this.in = 0;
    }
    click() {
        this.element.attr('contenteditable', 'true').focus();
        document.execCommand('selectAll', false, null);
    }
    render() {
        return Pluto.li.props({
            innerText: this.data.key
        }).on("click", () => this.click()).on("blur", () => {
            this.data = {
                key: this.element.text()
            }
        });
    }
}


var ulcontainer = {
        component: ul,
        props: {
            name: "ul",
            data: [{
                "key": "li 1"
            }, {
                "key": "li 2"
            }]
        }
    },
    result = Pluto.div;
Pluto.query(document.getElementById("root")).render(
    ulcontainer,
    Pluto.button.text("ekle").on("click", () => {
        PlutoComponents.ul.pushData({
            "key": "li " + (PlutoComponents.ul.data.length + 1)
        });
    }),
    Pluto.button.text("getir").on("click", () => {
        result.text(JSON.stringify(PlutoComponents.ul.data));
    }),
    result
)
```
