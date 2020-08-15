import {
    Pluto,
    ul
} from './ul.js';

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
Pluto.query(document.body).render(
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