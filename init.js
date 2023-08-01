import { Pluto } from "./PlutoSW.js";
import Tab from "./tab.js";

var tab = new Tab({
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

tab.go(2);

Pluto.query("#root").child(tab);
