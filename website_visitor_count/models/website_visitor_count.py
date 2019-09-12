# -*- coding: utf-8 -*-
from odoo import fields, models, api
from odoo.http import request


class ResCompany(models.Model):
    _inherit = "res.company"

    website_visitor_count = fields.Integer(
        string='Website Page Visits',
        help='Number of views on Website.'
    )


class Website(models.Model):
    _inherit = "website"

    @api.multi
    def get_view_count(self):
        website_visitor_count = request.session.get('website_visitor_count', 0)
        self.env.user.company_id.sudo().write({
            'website_visitor_count': website_visitor_count
        })
        return website_visitor_count