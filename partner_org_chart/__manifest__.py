# -*- coding: utf-8 -*-
{
    "name": "Partner Organization Chart",
    "summary": """Organization Chart Widget for Partner""",
    "description": """Organization Chart Widget for Partner""",
    "depends": ["base", "contacts"],
    "author": "Moltis Technologies, Odoo SA",
    "website": "www.moltis.net",
    "support": "info@moltis.net",
    "category": "Tools",
    "version": "13.0.0.1",
    "data": [
        "views/partner_templates.xml",
        "views/partner_views.xml"
    ],
    "qweb": [
        "static/src/xml/partner_org_chart.xml",
    ],
    "images": ["static/description/banner.png"],
    "license": "AGPL-3",
    "application": True,
    "installable": True,
}
