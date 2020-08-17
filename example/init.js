import {
    Pluto,
    ul
} from './ul.js';
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