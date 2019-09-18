# -*- coding: utf-8 -*-
import odoo
from odoo import http
from odoo.http import request
import odoo.modules.registry


class Export(http.Controller):
    def child_ids_get(self, model, fieldname, record_id, parent=False, pname= False):
        result = {}
        Model = request.env[model]
        record_id = Model.sudo().browse(record_id)
        if record_id and not parent:
            child_ids = [child_id.id for child_id in record_id[fieldname]]
        else:
            child_ids = [child_id.id for child_id in record_id]
        if child_ids:
            child_ids = Model.sudo().search_read(
                [('id', 'in', child_ids)], ['name', 'display_name', 'id']
            )
            for child_id in child_ids:
                perant_name = ''
                child_id.update({
                    'model': model,
                    'fieldname': fieldname
                })
                if parent:
                    child_id.update({
                        'pname': child_id.get('name', '')
                    })
                if pname:
                    perant_name  = pname + "/" + child_id.get('name', '')
                    child_id.update({
                        'pname': perant_name
                    })
                result.update({
                    child_id['id']: child_id
                })
        return result

    def chekck_child_ids(self, model, fieldname, rec_id):
        Model = request.env[model]
        rec_id = Model.sudo().browse(rec_id)
        if rec_id[fieldname]:
            return True
        return False

    @http.route('/product_tree_widget/get_records', type='json', auth="user")
    def get_records(
        self, model,
        fieldname, record_id=None,
        parent=None, pname=None,
        prefix='', parent_name='',
        exclude=None
    ):
        if not record_id:
            return []
        child_ids = self.child_ids_get(model, fieldname, record_id, parent=parent, pname=pname)
        child_ids_sequence = sorted(
            child_ids.items(),
            key=lambda field: odoo.tools.ustr(field[1].get('name', ''))
        )
        records = []
        for name, field in child_ids_sequence:
            name = parent_name + (parent_name and '/' or '') + field['name']
            record = {
                'id': field['id'], 'string': name,
                'value': field['id'], 'children': False,
                'model': model,
                'pname':  field['pname'],
                'fieldname': fieldname
            }
            records.append(record)

            if self.chekck_child_ids(model, fieldname, field['id']):
                record['children'] = True
        return records
