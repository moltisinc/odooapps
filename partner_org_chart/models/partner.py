# -*- coding: utf-8 -*-
from odoo import api, fields, models


class Partner(models.Model):
    _name = "res.partner"
    _inherit = "res.partner"

    child_all_count = fields.Integer(
        'Indirect Surbordinates Count',
        compute='_compute_child_all_count', store=False)
    child_org_ids = fields.One2many("res.partner", related="child_ids")



    @api.depends('child_ids.child_all_count')
    def _compute_child_all_count(self):
        for partner in self:
            partner.child_all_count = len(partner.child_ids) + sum(child.child_all_count for child in partner.child_ids)
