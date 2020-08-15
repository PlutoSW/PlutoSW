import {
    Pluto,
    ul
} from './ul.js';

var result = Pluto.code,
    ulcontainer = {
        component: ul,
        props: {
            name: "ul",
            result: result,
            data: [{
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
        result.text(JSON.stringify(PlutoComponents.ul.data));
    }),
    result
)