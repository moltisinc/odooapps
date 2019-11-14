odoo.define('web.PartnerOrgChart1', function (require) {
"use strict";

var AbstractField = require('web.AbstractField');
var concurrency = require('web.concurrency');
var core = require('web.core');
var field_registry = require('web.field_registry');

var QWeb = core.qweb;
var _t = core._t;

var PartnerOrgChart = AbstractField.extend({

    events: {
        "click .o_partner_redirect": "_onPartnerRedirect",
        "click .o_partner_sub_redirect": "_onPartnerSubRedirect",
    },
    /**
     * @constructor
     * @override
     */
    init: function () {
        this._super.apply(this, arguments);
        this.dm = new concurrency.DropMisordered();
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Get the chart data through a rpc call.
     *
     * @private
     * @param {integer} partner_id
     * @returns {Deferred}
     */
    _getOrgData: function (partner_id) {
        var self = this;
        return this.dm.add(this._rpc({
            route: '/partner/get_org_chart',
            params: {
                partner_id: partner_id,
            },
        })).then(function (data) {
            self.orgData = data;
        });
    },
    /**
     * @override
     * @private
     */
    _render: function () {
        if (!this.recordData.id) {
            return this.$el.html(QWeb.render("partner_org_chart", {
                children: [],
                managers: [],
            }));
        }

        var self = this;
        return this._getOrgData(this.recordData.id).then(function () {
            self.$el.html(QWeb.render("res_org_chart", self.orgData));
            self.$('[data-toggle="popover"]').each(function () {
                $(this).popover({
                    html: true,
                    title: function () {
                        var $title = $(QWeb.render('res_orgchart_partner_popover_title', {
                            partner: {
                                name: $(this).data('partner-name'),
                                id: $(this).data('partner-id'),
                            },
                        }));
                        $title.on('click',
                            '.o_partner_redirect', _.bind(self._onPartnerRedirect, self));
                        return $title;
                    },
                    container: 'body',
                    placement: 'left',
                    trigger: 'focus',
                    content: function () {
                        var $content = $(QWeb.render('res_orgchart_partner_popover_content', {
                            partner: {
                                id: $(this).data('partner-id'),
                                name: $(this).data('partner-name'),
                                direct_sub_count: parseInt($(this).data('partner-dir-subs')),
                                indirect_sub_count: parseInt($(this).data('partner-ind-subs')),
                            },
                        }));
                        $content.on('click',
                            '.o_partner_sub_redirect', _.bind(self._onPartnerSubRedirect, self));
                        return $content;
                    },
                    template: $(QWeb.render('res_orgchart_partner_popover', {})),
                });
            });
        });
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Redirect to the partner form view.
     *
     * @private
     * @param {MouseEvent} event
     * @returns {Deferred} action loaded
     */
    _onPartnerRedirect: function (event) {
        event.preventDefault();
        var partner_id = parseInt($(event.currentTarget).data('partner-id'));
        return this.do_action({
            type: 'ir.actions.act_window',
            view_type: 'form',
            view_mode: 'form',
            views: [[false, 'form']],
            target: 'current',
            res_model: 'res.partner',
            res_id: partner_id,
        });
    },
    /**
     * Redirect to the sub partner form view.
     *
     * @private
     * @param {MouseEvent} event
     * @returns {Deferred} action loaded
     */
    _onPartnerSubRedirect: function (event) {
        event.preventDefault();
        var partner_id = parseInt($(event.currentTarget).data('partner-id'));
        var partner_name = $(event.currentTarget).data('partner-name');
        var type = $(event.currentTarget).data('type') || 'direct';
        var domain = [['parent_id', '=', partner_id]];
        var name = _.str.sprintf(_t("Direct Subordinates of %s"), partner_name);
        if (type === 'total') {
            domain = ['&', ['parent_id', 'child_of', partner_id], ['id', '!=', partner_id]];
            name = _.str.sprintf(_t("Subordinates of %s"), partner_name);
        } else if (type === 'indirect') {
            domain = ['&', '&',
                ['parent_id', 'child_of', partner_id],
                ['parent_id', '!=', partner_id],
                ['id', '!=', partner_id]
            ];
            name = _.str.sprintf(_t("Indirect Subordinates of %s"), partner_name);
        }
        if (partner_id) {
            return this.do_action({
                name: name,
                type: 'ir.actions.act_window',
                view_mode: 'kanban,list,form',
                views: [[false, 'kanban'], [false, 'list'], [false, 'form']],
                target: 'current',
                res_model: 'res.partner',
                domain: domain,
            });
        }
    },
});

field_registry.add('partner_org_chart', PartnerOrgChart);

return PartnerOrgChart;

});
