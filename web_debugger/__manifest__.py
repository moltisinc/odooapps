# -*- coding: utf-8 -*-
{
    "name": "Odoo Developer Mode",
    "version": "13.0.0.1",
    "category": "Extra Tools",
    "summary": "Odoo Developer Mode",
    "author": "Moltis Technologies",
    "website": "www.moltis.net",
    "support": "info@moltis.net",
    "description": """
       Odoo Developer Mode.
    """,
    "depends": ["web"],
    "data": [
        "views/debugger_template.xml",
    ],
    "qweb": [
        "static/src/xml/debugger.xml",
    ],
    "images": ["static/description/banner.png"],
    "license": "AGPL-3",
    "installable": True,
    "auto_install": False,
    "application": False,
}
