# -*- coding: utf-8 -*-
{
    "name": "Product Tree View Widget (BOM)",
    "version": "11.0.0.1",
    "summary": "Product Tree View Widget (BOM)",
    "sequence": 1,
    "description": """
        Product Tree View Widget (BOM)
    """,
    "category": "Web",
    "author": "Moltis Technologies",
    "website": "www.moltis.net",
    "support": "info@moltis.net",
    "images": ["static/description/banner.png"],
    "depends": ["mrp"],
    "data": [
        "views/product.xml",
        "views/product_view.xml"
    ],
    "qweb": [
        "static/src/xml/tree_widget.xml"
    ],
    "license": "GPL-3",
    "installable": True,
    "application": False,
    "auto_install": False,
}
