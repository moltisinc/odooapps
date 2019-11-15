odoo.define('web_debugger.debugger_topbar', function(require) {
    "use strict";

    var SystrayMenu = require('web.SystrayMenu');
    var Widget = require('web.Widget');

    var debugger_menu = Widget.extend({
        template: 'web_debugger.debugger_menu',
        events: {
            "click .oe_debugger_menu_mode": "oe_debugger_menu_mode",
        },
        oe_debugger_menu_mode: function(event) {
            event.preventDefault();
            if (window.location.href.indexOf("?debug=assets") > -1) {
                window.location = window.location.href.replace('?debug=assets', '?debug=');
            } else {
                window.location = $.param.querystring(window.location.href, 'debug=assets');
            }
        },
    });
    
    SystrayMenu.Items.push(debugger_menu);
});
