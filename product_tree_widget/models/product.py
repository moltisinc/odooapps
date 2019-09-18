# -*- coding: utf-8 -*-

from odoo import api, fields, models


class ProductTemplate(models.Model):
    _inherit = "product.template"

    product_components = fields.One2many(
        'product.template',
        compute='_compute_product_template_components',
        string='Product Components'
    )

    @api.multi
    def _compute_product_template_components(self):
        for product in self:
            for bom in product.mapped('bom_ids').filtered(lambda bom: bom.bom_line_ids):
                for line in bom.bom_line_ids:
                    product.product_components += line.product_id.product_tmpl_id


class ProductProduct(models.Model):
    _inherit = "product.product"

    product_components = fields.One2many(
        'product.product',
        compute='_compute_product_template_components',
        string='Product Components'
    )

    @api.multi
    def _compute_product_template_components(self):
        for product in self:
            for bom in product.mapped('bom_ids').filtered(lambda bom: bom.bom_line_ids):
                for line in bom.bom_line_ids:
                    product.product_components += line.product_id
