import {
    Pluto,
    PlutoComponent
} from '../PlutoSW.js';
import li from './li.js';

class ul extends PlutoComponent {
    constructor(data) {
        super(data.name);
        this.data = data.data;
    }
    onDataPush(){
        
    }
    render() {
        var elem = [];
        for (const data of this.data) {
            elem.push({
                component: li,
                props: data
            });
        }
        return Pluto.ul.child(...elem);
    }
}
export {
    Pluto,
    PlutoComponent,
    ul
}