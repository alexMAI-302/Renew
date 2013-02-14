//фильтр
Ext.define('app.view.Lib.DateIntervalFilter', {
	extend : 'Ext.container.Container',
	alias : 'widget.dateIntervalFilter',

	/**
	 * Creates the Proxy
	 * @param {Object} config Config object.
	 * suffix - специальное имя для компонента. используется при построении идентификатора объектов
	 * filterButton - объект конфигурации кнопки фильтра
	 * startDate - дата начала периода. По умолчанию сегодня
	 * endDate - дата конца периода. По умолчанию сегодня
	 * shiftInterval - интервал сдвига (на основе констант Ext.Date). По умолчанию Ext.Date.DAY
	 * shiftBegin - величина сдвига относительно даты конца. По умолчанию 0
	 * shiftEnd - величина сдвига относительно даты конца. По умолчанию 0
	 * extraItems - дополнительные элементы. Передается "сырая" конфигурация
	 */
	constructor : function(config) {
		config = config || {};
		items = [{
			id : 'ddateb' + config.suffix,
			xtype : 'datefield',
			fieldLabel : 'С',
			format : 'd.m.Y',
			altFormat : 'd/m/Y|d m Y',
			startDay : 1,
			value : Ext.Date.add(
				Ext.Date.parse(config.beginDate || Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'),
				(config.shiftInterval || Ext.Date.DAY),
				(config.shiftBegin || 0)),
			width : 125,
			labelWidth : 25
		}, {
			id : 'ddatee' + config.suffix,
			xtype : 'datefield',
			fieldLabel : 'По',
			format : 'd.m.Y',
			altFormat : 'd/m/Y|d m Y',
			startDay : 1,
			value : Ext.Date.add(
				Ext.Date.parse(config.endDate || Ext.Date.format(new Date(), 'Y.m.d'), 'Y.m.d'),
				(config.shiftInterval || Ext.Date.DAY),
				(config.shiftEnd || 0)),
			width : 125,
			labelWidth : 25
		}];

		if(config.filterItems != null) {
			for(var i = 0; i < config.filterItems.length; i++) {
				config.filterItems[i].id += config.suffix
				items.push(config.filterItems[i]);
			}
		}

		if(config.filterButton){
			items.push(config.filterButton);
		} else {
			items.push({
				id : 'filter' + config.suffix,
				xtype : 'button',
				text : 'Фильтр'
			});
		}
		
		if(config.extraItems != null) {
			for(var i = 0; i < config.extraItems.length; i++) {
				config.extraItems[i].id += config.suffix
				items.push(config.extraItems[i]);
			}
		}

		Ext.apply(this, {
			layout : config.layout || {
				type : 'hbox'
			},
			defaults : config.defaults || {
				style : {
					margin : '5px'
				}
			},
			items : items
		});

		this.callParent(arguments);
	}
});
