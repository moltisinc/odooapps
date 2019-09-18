odoo.define('product_tree_widget.product_tree_widget', function(require) {
'use strict';
    var AbstractField = require('web.AbstractField');
    var Widget = require('web.Widget');
    var core = require('web.core');
    var FormRenderer = require('web.FormRenderer');
    var registry = require('web.field_registry');
    var _t = core._t;
    var qweb = core.qweb;
    var data = require('web.data');
    var BasicModel = require("web.BasicModel");
    var DataManager = require("web.DataManager");

    DataManager.include({
        ///////////////////////////////////////////////////////////////

        /**
         * Process a field node, in particular, put a flag on the field to give
         * special directives to the BasicModel.
         *
         * @param {string} viewType
         * @param {Object} field - the field properties
         * @param {Object} attrs - the field attributes (from the xml)
         * @returns {Object} attrs
         */
        _processField: function (viewType, field, attrs) {
            var result = this._super(viewType, field, attrs);
            if (field.type === 'one2many' || field.type === 'many2many') {
                if (attrs.Widget.prototype.fieldsToFetch) {
                    if (attrs.widget == 'one2many_tree') {
                        // used by m2m tags
                        attrs.relatedFields[attrs.name] = { type: 'one2many' };
                        attrs.fieldsInfo.default[attrs.name] = {};
                    }
                }
            }
            return result
        },
    });

    var FieldOne2ManyTree = AbstractField.extend({
        template: 'FieldOne2ManyTree',
        className: 'o_one2many_tree',
        specialData: "_fetchSpecialRelation",
        supportedFieldTypes: ['many2many'],
        fieldsToFetch: {
            name: {type: "char"},
            display_name: {type: "char"},
        },
        events: {
            'click .o_expand_parent': function(e) {
                this.on_expand_action(this.records[$(e.target).closest('.o_tree_structure_item').data('id')]);
            },
            'dblclick .o_tree_structure_item': function(e) {
                e.stopPropagation();
                var $elem = $(e.currentTarget);
                var row_index = $elem.prevAll('.o_tree_structure_item').length;
                var row_index_level = $elem.parents('.o_tree_structure_item').length;
                if(e.shiftKey && row_index_level === this.row_index_level) {
                var minIndex = Math.min(row_index, this.row_index);
                var maxIndex = Math.max(row_index, this.row_index);

                this.$records.filter(function() { return ($elem.parent()[0] === $(this).parent()[0]); })
                                .slice(minIndex, maxIndex+1)
                                .addClass('o_selected')
                                .filter(':not(:last)')
                                .each(process_children);
                }
   
               this.row_index = row_index;
               this.row_index_level = row_index_level;
   
                if(e.ctrlKey) {
                    $elem.toggleClass('o_selected').focus();
                } else if(e.shiftKey) {
                    $elem.addClass('o_selected').focus();
                } else {
                    this.$(".o_selected").removeClass("o_selected")
                    $elem.addClass("o_selected").focus();
                }
   
                function process_children() {
                    var $this = $(this);
                    if($this.hasClass('open')) {
                        $this.children('.o_tree_structure_item')
                            .addClass('o_selected')
                            .each(process_children);
                    }
                }
                
                this.on_open_action(this.records[$(e.target).closest('.o_tree_structure_item').data('id')]);
            },
            'keydown .o_tree_structure_item': function(e) {
                e.stopPropagation();
                var $elem = $(e.currentTarget);
                var record = this.records[$elem.data('id')];
    
                switch(e.keyCode || e.which) {
                    case $.ui.keyCode.LEFT:
                        if ($elem.hasClass('open')) {
                            this.on_expand_action(record);
                        }
                        break;
                    case $.ui.keyCode.RIGHT:
                        if (!$elem.hasClass('open')) {
                            this.on_expand_action(record);
                        }
                        break;
                    case $.ui.keyCode.UP:
                        var $prev = $elem.prev('.o_tree_structure_item');
                        if($prev.length === 1) {
                            while($prev.hasClass('open')) {
                                $prev = $prev.children('.o_tree_structure_item').last();
                            }
                        } else {
                            $prev = $elem.parent('.o_tree_structure_item');
                            if($prev.length === 0) {
                                break;
                            }
                        }
    
                        $elem.removeClass("o_selected").blur();
                        $prev.addClass("o_selected").focus();
                        break;
                    case $.ui.keyCode.ENTER:
                        this.on_open_action(this.records[$(e.target).closest('.o_tree_structure_item').data('id')]);
                        break;
                    case $.ui.keyCode.DOWN:
                        var $next;
                        if($elem.hasClass('open')) {
                            $next = $elem.children('.o_tree_structure_item').first();
                        } else {
                            $next = $elem.next('.o_tree_structure_item');
                            if($next.length === 0) {
                                $next = $elem.parent('.o_tree_structure_item').next('.o_tree_structure_item');
                                if($next.length === 0) {
                                    break;
                                }
                            }
                        }
    
                        $elem.removeClass("o_selected").blur();
                        $next.addClass("o_selected").focus();
                        break;
                }
            },

        },
        init: function () {
            this._super.apply(this, arguments);
            var self = this;
            self.name = this.name;
            this.records = {};
            self.record = this.record;
            this.exports = new data.DataSetSearch(this, self.model, this.record.getContext());
            this.row_index = 0;
            this.row_index_level = 0;
        },
        on_open_action: function(record) {
            var self= this;
            var model = record['model'];
            var record_id = record['id'];
            this._rpc({
                model: model,
                method: 'get_formview_action',
                args: [[record_id]],
            })
            .then(function (action) {
                self.trigger_up('do_action', {action: action});
            });
        },
        on_expand_action: function(record) {
            if(!record['children']) {
                return;
            }
    
            var model = record['model'];
            var record_id = record['id'];
            var fieldname = record['fieldname'];
            var pname = record['pname'];
            var exclude_fields = [];
            if(!record.loaded) {
                var self = this;
                this._rpc({
                        route: '/product_tree_widget/get_records',
                        params: {
                            model: model,
                            fieldname: fieldname,
                            record_id: record_id,
                            parent: false,
                            pname: pname,
                        },
                    })
                    .done(function(results) {
                        record.loaded = true;
                        self.on_show_data(results, record.id);
                    });
            } else {
                this.show_content(record.id);
            }
        },
        on_show_data: function(records, expansion) {
            var self = this;
            if(expansion) {
                this.$('.o_tree_structure_item[data-id="' + expansion + '"]')
                    .addClass('open')
                    .find('.o_expand_parent')
                    .toggleClass('fa-plus fa-minus')
                    .next()
                    .after(qweb.render('FieldOne2ManyTree.TreeItems', {'fields': records}));
            } else {
                this.$('#One2ManyTree').empty().append(
                    $("<div/>").addClass('o_field_tree_structure')
                               .append(qweb.render('FieldOne2ManyTree.TreeItems', {'fields': records}))
                );
            }
    
            _.extend(this.records, _.object(_.pluck(records, 'id'), records));
            this.$records = this.$(".o_tree_structure_item");
        },
        show_content: function(id) {
            var $this = this.$('.o_tree_structure_item[data-id="' + id + '"]');
            $this.toggleClass('open');
            var is_open = $this.hasClass('open');
            var record = this.records[$this.data('id')]
            $this.children('.o_expand_parent').toggleClass('fa-minus', !!is_open).toggleClass('fa-plus', !is_open);
    
            var $child_field = $this.find('.o_tree_structure_item');
            var child_len = (record['pname'].split("/")).length + 1;
            for (var i = 0 ; i < $child_field.length ; i++) {
                var $child = $child_field.eq(i);
                if(!is_open) {
                    $child.hide();
                } else if(child_len === this.records[$child_field.eq(i).data('id')]['pname'].split("/").length) {
                    if ($child.hasClass('open')) {
                        $child.removeClass('open');
                        $child.children('.o_expand_parent').removeClass('fa-minus').addClass('fa-plus');
                    }
                    $child.show();
                }
            }
        },
        start: function() {
            var self = this;
            var waitFor = [this._super.apply(this, arguments)];
            var got_fields = new $.Deferred();
            self.$('.o_field_tree_structure').remove();

            self._rpc({
                route: '/product_tree_widget/get_records',
                params: {
                    model: self.record.model,
                    fieldname: self.name,
                    record_id: self.record.res_id,
                    parent: true
                },
            })
            .done(function (records) {
                var compatible_fields = _.map(records, function (record) {return record.id; });
                got_fields.resolve();
                self.on_show_data(records);
            });
            return $.when.apply($, waitFor);
        },
        get_fields: function() {
            var $export_fields = this.$(".o_fields_list option").map(function() {
                return $(this).val();
            }).get();
            return $export_fields;
        },
    });

    FormRenderer.include({
        _renderTagSlider: function (node) {
            var self = this;
            var $img = $(qweb.render('FormView.TreeSlider', {widget: this, node: node}));
            _.each(node.children, function (child) {
                if (child.tag === 'field') {
                    var widget = self._renderFieldWidget(child, self.state);
                    $img.find('#ontTree').append(widget.$el);
                }
            });
            return $img;
        },
    });

    registry.add('one2many_tree', FieldOne2ManyTree);

    return {
        FieldOne2ManyTree: FieldOne2ManyTree,
    };

});
