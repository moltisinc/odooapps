# -*- coding: utf-8 -*-
from odoo import http, tools, _
from odoo.http import request
from odoo.addons.website.controllers.main import Website


class WebsiteVisitorCount(Website):

    @http.route('/', type='http', auth="public", website=True)
    def index(self, **kw):
        company = request.env.user.company_id
        website_visitor_count = company.website_visitor_count or 0
        website_visitor_count += 1
        request.session.update({'website_visitor_count': "{:07d}".format(website_visitor_count)})
        return super(WebsiteVisitorCount, self).index(**kw)