# -*- coding: utf-8 -*-
{
    'name': 'Every Email Send to a Company BCC(Blank carbon copy)',
    "version": "13.0.0.1",
    'category': 'Email',
    'summary': 'Send email to a company in BCC(Blank carbon copy)',
    'description': """
        Every Email Send to a Company in BCC(blank carbon copy) whatever email send to a Customer.
    """,
    "author": "Moltis Technologies",
    "website": "www.moltis.net",
    "support": "info@moltis.net",
    'images': ['static/description/banner.png'],
    'depends': [
        'base', 'mail'
    ],
    'data': [ 'views/res_company_view.xml'],
    'demo': [],
    'qweb': [],
    "license": "GPL-3",
    "application": True,
    "installable": True,
    'auto_install': False,
}
