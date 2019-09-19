# -*- coding: utf-8 -*-
from odoo import tools, api, models, _, fields
from odoo.exceptions import UserError
from odoo.tools import config

class ResUsers(models.Model):
    _inherit = 'res.users'

    @api.model
    def create(self, vals):
        users = len(self.env['res.users'].search([]))
        user_limits = int(tools.config.get('user_limits', 5))
        if user_limits <= users:
            raise UserError("Maximum number of users created. Please contact to your system administrator!")
        res = super(ResUsers, self).create(vals)
        return res