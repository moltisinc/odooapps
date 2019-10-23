# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
from datetime import datetime


class Screenshot(http.Controller):

    @http.route('/web_screenshot/save_image', type='json', auth="public")
    def all_reminder(self, image):
        image_url = False
        name = datetime.strftime(datetime.now(), "%Y_%m_%d_%H_%M_%S") + '.png'
        attachment_id = request.env['ir.attachment'].sudo().create({
            'name': name,
            'datas': image,
            'datas_fname': name,
            'type': 'binary',
            'store_fname': name,
        })
        image_url = '/web/content/%s/%s?download=true' % (attachment_id.id, name)
        return image_url
