import {
    Pluto, PlutoComponent,
} from '../PlutoSW.js';
/**/
class Area extends PlutoComponent {
    constructor() {
        super();
        this.content = Pluto.div.props({
            innerText: "This text not changed",
            className: "area"
        }).change((old, newText) => {
            this.log.element.value = "Text changed\n" + "Old Text: " + old + "\n" + "New Text: " + newText;
        });
        this.input = Pluto.input.props({
            className: "input",
            placeholder: "write here",
            value: "This text was changed"
        });
        this.log = Pluto.textarea.props({
            className: "log"
        });
        this.element = Pluto.div.child(this.content, this.input, Pluto.button.props({
            innerText: "Change",
            className: "button"
        }).on("click", () => {
            this.content.element.innerText = this.input.value();
        }), Pluto.br, this.log);
    }

    render() {
        return this.element;
    }
}

Pluto.query(document.getElementById("root")).render(
    {
        component: Area
    }

)
