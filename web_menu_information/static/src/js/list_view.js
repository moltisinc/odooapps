odoo.define('web_menu_information.info', function (require) {
    "use strict";

    var core = require('web.core');
    var Dialog = require('web.Dialog');
    var ListController = require('web.ListController');
    var QWeb = core.qweb;
    var _t = core._t;

    ListController.include({
        renderButtons: function () {
            var self = this;
            var context = this.model.get(this.handle, {raw: true}).getContext();
            this._super.apply(this, arguments);
            this.$buttons.on('click', '.o_list_button_info', this.__onInfo.bind(this));
        },
        __onInfo: function (ev) {
            ev.stopPropagation();
            this._information();
        },
        _information: function (recordID) {
            var self = this;
            var action = self.initialState.context.params.action;
            self._rpc({
                route: '/web/action/load',
                params: {action_id: action},
            }).then(function(result) {
                var buttons = [
                    {
                        text: _t("Ok"),
                        close: true,
                    },
                ];
                return new Dialog(this, {
                    size: 'medium',
                    title: _t("Information"),
                    buttons: buttons,
                    $content: $('<div>', {
                        html: result.help,
                    }),
                }).open();
            });
        },
    });
});