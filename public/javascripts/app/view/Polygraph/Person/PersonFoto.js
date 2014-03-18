Ext.define('app.view.Polygraph.PersonFoto', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.polygraph_person_foto',
	id: 'Polygraph_PersonFoto',
	
	
	title: 'Фото',
	autoScroll: true,
		autoScroll: true,
	items: [
		{
			id: 'PolygraphPicturesList',
			xtype: 'dataview',
			store: 'Polygraph.Pictures',
			emptyText: 'Нет изображений',
			itemSelector: 'div.picture',
			multiSelect: true,
			autoScroll: true,
			overItemCls: 'picture-hover',
			plugins: [
				Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'name'})
			],
			tpl : Ext.create(
				'Ext.XTemplate',
				'<tpl for=".">',
				'<div class="picture">',
				(!Ext.isIE6 ?
					'<img width="{small_width}" height="{small_height}"  src="/polygraph/get_picture_small/{id},{name}" />' : //параметр name нужен в конце чтобы картинка обновлялась
					'<div style="width:{small_width}px;height:{small_height}px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'\',sizingMethod=\'scale\')"></div>'),
				'<span class="x-editable">{name}</span>',
				'</div>',
				'</tpl>'),
			listeners: {
				itemdblclick: function(view, record, item, index, e, eOpts){
					window.open("/polygraph/get_picture_full/" + record.get('id'), '_blank');
				}
			}
		}
	]
    });