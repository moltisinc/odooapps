odoo.define('web_screenshot.screenshot_topbar', function (require) {
"use strict";

    var core = require('web.core');
    var SystrayMenu = require('web.SystrayMenu');
    var Widget = require('web.Widget');
    var QWeb = core.qweb;
    var ajax = require('web.ajax');

    var screenshot_menu = Widget.extend({
        template:'web_screenshot.screenshot_menu',
        events: {
            "click .screenshot-toggle": "on_click_screenshot",
        },
        on_click_screenshot: function (event) {
            var self = this;
            self.getCanvas = '';
            html2canvas(document.querySelector(".o_web_client"))
            .then(function(canvas){
                self.getCanvas = canvas;
                var imgageData = self.getCanvas.toDataURL("image/png");
                var newData = imgageData.replace(/^data:image\/png\;base64,/, "");
                ajax.jsonRpc(
                "/web_screenshot/save_image", 'call',{'image': newData}
                ).then(function(image_url){
                     window.open(image_url, '_blank');
                });
            });
        },
    });

    SystrayMenu.Items.push(screenshot_menu);
});
