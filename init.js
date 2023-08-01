import {
    Pluto
} from '../PlutoSW.js';
import Tab from './tab.js';

var tab = new tab({
                name: "ProfileTab",
                tabs: ["account", "cards", "addresses", "invoices", "logout"],
                content: [Pluto.span("profile"), Pluto.span("cards") , "addresses", "invoices", "logout"],
            });

tab.go(2)
