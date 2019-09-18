# -*- coding: utf-8 -*-
{
    "name": "Showing a Menu ToolTip in Odoo",
    "summary": """
        Showing a Menu ToolTip in Odoo
        """,
    "description": """
        Showing a Menu ToolTip in Odoo 
    """,
    "author": "Moltis Technologies",
    "website": "www.moltis.net",
    "support": "info@moltis.net",
    "category": "Tools",
    "version": "12.0.0.1",
    "depends": ["base", "web"],
    "data": [
        "views/action_view.xml",
        "views/template.xml",
    ],
    'qweb': [
        "static/src/xml/menu.xml",
    ],
    "images": ["static/description/banner.png"],
    "license": "GPL-3",
    "application": True,
    "installable": True,
}