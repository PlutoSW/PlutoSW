import {
    Pluto,
    PlutoComponent
} from '../PlutoSW.js';
import li from './li.js';

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
export {
    Pluto,
    PlutoComponent,
    ul
}