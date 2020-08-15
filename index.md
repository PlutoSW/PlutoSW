## PlutoSW DOM Manipulator and Component Manager


### Example
<style>
div#root {
     padding: 15px;
    border: 1px solid;
    margin-bottom: 30px;
}
div#root code {
    display: block;
    padding: 5px;
    color: black;
    background: aliceblue;
}
div#root button {
    margin-bottom: 9px;
    margin-right: 8px;
}   
</style>
<div id="root"></div>
<script type="module">
import {Pluto,PlutoComponent} from './PlutoSW.js';
class ul extends PlutoComponent {
    constructor(props) {
        super(props.name, props.data);
        this.props = props;
    }
    onDataPush() {
        this.render(this.element, this.dataDiff);
    }
    onMount(){
        console.log(this.data);
        this.props.result.text(JSON.stringify(PlutoComponents.ul.data));
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


var result = Pluto.div,
    ulcontainer = {
        component: ul,
        props: {
            result: result,
            name: "ul",
            data: [{
                "key": "li 1"
            }, {
                "key": "li 2"
            }]
        }
    };
Pluto.query(document.getElementById("root")).render(
    ulcontainer,
    Pluto.button.text("addData").on("click", () => {
        PlutoComponents.ul.pushData({
            "key": "li " + (PlutoComponents.ul.data.length + 1)
        });
    }),
    Pluto.button.text("getData").on("click", () => {
        result.text(JSON.stringify(PlutoComponents.ul.data));
    }),
    result
)
</script>
```javascript
import {Pluto,PlutoComponent} from './PlutoSW.js';
class ul extends PlutoComponent {
    constructor(props) {
        super(props.name, props.data);
        this.props = props;
    }
    onDataPush() {
        this.render(this.element, this.dataDiff);
    }
    onMount(){
        console.log(this.data);
        this.props.result.text(JSON.stringify(PlutoComponents.ul.data));
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


var result = Pluto.div,
    ulcontainer = {
        component: ul,
        props: {
            result: result,
            name: "ul",
            data: [{
                "key": "li 1"
            }, {
                "key": "li 2"
            }]
        }
    };
Pluto.query(document.getElementById("root")).render(
    ulcontainer,
    Pluto.button.text("addData").on("click", () => {
        PlutoComponents.ul.pushData({
            "key": "li " + (PlutoComponents.ul.data.length + 1)
        });
    }),
    Pluto.button.text("getData").on("click", () => {
        result.text(JSON.stringify(PlutoComponents.ul.data));
    }),
    result
)
```
