## PlutoSW -  DOM Manipulator and Component Manager


### Example
<style>
div#root {
  padding: 15px;
  border: 1px solid;
  margin-bottom: 30px;
  text-align: center;
}

li {
  list-style: none;
  text-align: left;
  margin: 8px 5px;
  border: 1px solid lightgray;
  padding: 10px;
}

ul {
  margin: 0;
  padding: 0;
}

div#root pre {
  text-align: left;
  display: block;
  padding: 5px;
  color: black;
  background: aliceblue;
}

div#root button {
  margin: 9px 2px 19px 0px;
  height: 40px;
  width: 80px;
  background: green;
  border: 1px solid #000000;
  color: #fff;
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
    onDataChange() {
        this.render(this.element, this.dataDiff);
        localStorage.data = JSON.stringify(PlutoComponents.ul.data);
    }
    onMount() {
        this.props.result.html(JSON.highlight(PlutoComponents.ul.data));
    }
    render(target = Pluto.ul, data = this.data) {
        var elem = [];
        data.forEach(function (d) {
            elem.push({
                component: li,
                props: d
            });
        })
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
    onDataChange(){
        PlutoComponents.ul.props.result.html(JSON.highlight(PlutoComponents.ul.data));
    }
    render() {
        return Pluto.li.props({
            innerText: this.data.key
        }).on("click", () => this.click()).on("blur", () => {
            console.log(this.element.text());
            this.data = {
                key: this.element.text()
            }
            localStorage.data = JSON.stringify(PlutoComponents.ul.data);
        });
    }
}


window.storeddata = (localStorage.data) ? JSON.parse(localStorage.data) : null;
var result = Pluto.pre,
    ulcontainer = {
        component: ul,
        props: {
            name: "ul",
            result: result,
            data: storeddata || [{
                "key": "li 1 (Click for edit)"
            }, {
                "key": "li 2 (Click for edit)"
            }]
        }
    };
Pluto.query(document.getElementById("root")).render(
    ulcontainer,
    Pluto.button.text("ekle").on("click", () => {
        PlutoComponents.ul.data.push({
            "key": "li " + (PlutoComponents.ul.data.length + 1)
        });
    }),
    Pluto.button.text("getir").on("click", () => {
        result.html(JSON.highlight(PlutoComponents.ul.data));
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
        localStorage.data = JSON.stringify(PlutoComponents.ul.data);
    }
    onMount() {
        this.props.result.html(JSON.highlight(PlutoComponents.ul.data));
    }
    render(target = Pluto.ul, data = this.data) {
        var elem = [];
        data.forEach(function (d) {
            elem.push({
                component: li,
                props: d
            });
        })
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
    onDataChange(){
        PlutoComponents.ul.props.result.html(JSON.highlight(PlutoComponents.ul.data));
    }
    render() {
        return Pluto.li.props({
            innerText: this.data.key
        }).on("click", () => this.click()).on("blur", () => {
            this.data = {
                key: this.element.text()
            }
            localStorage.data = JSON.stringify(PlutoComponents.ul.data);
        });
    }
}


window.storeddata = (localStorage.data) ? JSON.parse(localStorage.data) : null;
var result = Pluto.pre,
    ulcontainer = {
        component: ul,
        props: {
            name: "ul",
            result: result,
            data: storeddata || [{
                "key": "li 1 (Click for edit)"
            }, {
                "key": "li 2 (Click for edit)"
            }]
        }
    };
Pluto.query(document.getElementById("root")).render(
    ulcontainer,
    Pluto.button.text("ekle").on("click", () => {
        PlutoComponents.ul.pushData({
            "key": "li " + (PlutoComponents.ul.data.length + 1)
        });
    }),
    Pluto.button.text("getir").on("click", () => {
        result.html(JSON.highlight(PlutoComponents.ul.data));
    }),
    result
)
```
