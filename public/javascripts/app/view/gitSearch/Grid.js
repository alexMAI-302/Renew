Ext.define('app.view.gitSearch.Grid' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.gitSearchGrid',

    requires: [
        'Ext.grid.feature.Grouping',
        'app.store.gitSearch.Search'
    ],
    
	id: 'gitSearchGrid',
	
	store: 'gitSearch.Search',

	height: 400,

    features: [{
        ftype: 'grouping',
        groupHeaderTpl: '{columnName}: {name}',
        id: 'repoGrouping',
    }],

	columns: [{
		dataIndex: 'repo',
		text: 'Репозиторий',
		hidden: true,
		disabled: true
	}, {
		dataIndex: 'name',
		text: 'Объект',
		width: '50%',
		sortable: true,
		hideable: false,
		renderer: function(value, metaDate, record) {
			return Ext.String.format('<a target="_blank" href="https://github.com/Unact/{0}/blob/master/{1}">{1}</a>', record.data.repo, value);
        }
	}],
});