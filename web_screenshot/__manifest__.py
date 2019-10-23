# -*- coding: utf-8 -*-
{
    "name": "Web Screenshot",
    "version": "12.0.0.1",
    "category": "Extra Tools",
    "summary": "Web Screenshot",
    "author": "Moltis Technologies",
    "website": "www.moltis.net",
    "support": "info@moltis.net",
    "description": """
        Web Screenshot.
    """,
    "depends": ["base"],
    "data": [
        "security/ir.model.access.csv",
        "views/screenshot_template.xml",
    ],
    "qweb": [
        "static/src/xml/screenshot.xml", ],
    "images": ["static/description/banner.png"],
    "license": "AGPL-3",
    "installable": True,
    "auto_install": False,
    "application": False,
}
