## PlutoSW -  DOM Manipulator and Component Manager


### Example
<script type="module" src="./init.js"></script>
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

    .content {
        display: none;
    }

    .content.selected {
        display: block;
    }
</style>

<div id="root"></div>


```html
<script type="module">
    import { Pluto, PlutoComponent } from "./PlutoSW.js";
    class Tab extends PlutoComponent {
        #_contents;
        constructor(props) {
            super(props);
            this.props = props;
            this.selected = this.props.start ? this.props.start : 0;
            this.#_contents = props.content;
            this.tabs = props.tabs;
            this.currentTab = this.tabs[this.selected];
            this.tabsWrapper = Pluto.ul.class("tabs").child(...this.generateTabs());
            this.contentsWrapper = Pluto.div.class("contents").child(...this.generateContents().map(a => a.element));
            this.child(this.tabsWrapper, (this.line = Pluto.div.class("line").style("width", "0px")), this.contentsWrapper);
        }
        onConnect() {
            setTimeout(() => {
                this.line.style("width", this.dataTabs[this.selected].element.element.getBoundingClientRect().width + "px");
            }, 100);
        }
        generateTabs() {
            this.dataTabs = [];
            this.tabs.forEach((e, i) => {
                this.dataTabs.push({
                    name: e,
                    element: Pluto.li
                        .text(e)
                        .class(this.selected === i ? "selected" : "")
                        .on("click", () => {
                            this.go(i);
                        }),
                });
            });
            return this.dataTabs.map(a => a.element);
        }
        generateContents() {
            this.contents = [];
            this.#_contents.forEach((e, i) => {
                this.contents.push({
                    name: this.tabs[i],
                    type: typeof e === "string" ? e : "element",
                    element: Pluto.div.class("content", this.selected === i ? "selected" : "").child(typeof e !== "string" ? e : Pluto.div.class("loading").child(Pluto.div.class("sending"))),
                    render: element => {
                        this.contents[i].type = "element";
                        this.contents[i].element.render(element);
                    },
                });
            });
            return this.contents;
        }
        go(i) {
            if (typeof i === "string") {
                var index = this.tabs.indexOf(i);
                i = index === -1 ? 0 : index;
            } else {
                i = i;
            }
            this?.beforeNavigate?.(i);
            this.previous = this.selected;
            this.selected = i;
            this.currentTab = this.tabs[this.selected];
            this.contents.map((a, e) => {
                if (e === i) {
                    this.dataTabs[e].element.class("selected");
                    a.element.class("selected");
                    this.line.style({
                        transform: `translateX(${100 * this.selected}%)`,
                        width: this.dataTabs[this.selected].element.element.getBoundingClientRect().width + "px",
                    });
                } else {
                    this.dataTabs[e].element.removeClass("selected");
                    a.element.removeClass("selected");
                }
            });
            if (this.props.onSelect) {
                this.props.onSelect(this.dataTabs[i], this.contents[i]);
            }
            this?.onNavigate?.(i, this.dataTabs[i]);
            return this;
        }
    }
    Pluto.assign("fuuis-tab", Tab);


    var tab1 = new Tab({
        name: "ProfileTab",
        tabs: ["account", "cards", "addresses", "invoices", "logout"],
        content: [
            Pluto.span.class("account").text("account"),
            Pluto.span.class("cards").text("cards"),
            Pluto.span.class("addresses").text("addresses"),
            Pluto.span.class("invoices").text("invoices"),
            Pluto.span.class("logout").text("logout"),
        ],
    });
    tab1.go(2);

    Pluto.query("#root").child(tab1);
</script>
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

    .content {
        display: none;
    }

    .content.selected {
        display: block;
    }
</style>
<div id="root"></div>
```
