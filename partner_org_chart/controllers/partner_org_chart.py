# -*- coding: utf-8 -*-
from odoo import http
from odoo.exceptions import AccessError
from odoo.http import request


class PartnerOrgChartController(http.Controller):
    _managers_level = 2

    def _prepare_partner_data(self, partner):
        return dict(
            id=partner.id,
            name=partner.name,
            link='/mail/view?model=res.partner&res_id=%s' % partner.id,
            direct_sub_count=len(partner.child_ids),
            indirect_sub_count=partner.child_all_count,
        )

    @http.route('/partner/get_org_chart', type='json', auth='user')
    def get_org_chart(self, partner_id):
        if not partner_id:  # to check
            return {}
        partner_id = int(partner_id)

        Partner = request.env['res.partner']
        # check and raise
        if not Partner.check_access_rights('read', raise_exception=False):
            return {}
        try:
            Partner.browse(partner_id).check_access_rule('read')
        except AccessError:
            return {}
        else:
            partner = Partner.browse(partner_id)

        # compute partner data for org chart
        ancestors, current = request.env['res.partner'], partner
        while current.parent_id:
            ancestors += current.parent_id
            current = current.parent_id

        values = dict(
            self=self._prepare_partner_data(partner),
            managers=[self._prepare_partner_data(ancestor) for idx, ancestor in enumerate(ancestors) if idx < self._managers_level],
            managers_more=len(ancestors) > self._managers_level,
            children=[self._prepare_partner_data(child) for child in partner.child_ids],
        )
        values['managers'].reverse()
        return values
