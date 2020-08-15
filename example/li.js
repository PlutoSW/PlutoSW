import {
    Pluto,
    PlutoComponent
} from '../PlutoSW.js';
export default class li extends PlutoComponent {
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