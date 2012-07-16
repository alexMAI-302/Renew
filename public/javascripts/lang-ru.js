/* ***********************************************************
 * Доопределяем руссификацию из /ext/locale/ext-lang-ru.js
 *
 * Причина:
 * в ext-lang-ru.js кривая руссификация. календарь по-прежнему начинается с воскресенья.
 * ext-lang-ru.js менять не будем, может, в будущих версиях они исправят эту багу.
 *
 * При подключении в application.erb надо указывать полсе /ext/locale/ext-lang-ru.js,
 * потому что override применяется в порядке, указанном при подключении
 ************************************************************/
Ext.onReady(function() {
	Ext.define("app.locale.ru.form.field.Date", {
		override: "Ext.form.field.Date",
		startDay: 1,                                              //Начало недели - с понедельника
		format: 'd.m.Y'                                           //Год записывается четырьмя знаками
	});

	Ext.define("app.locale.ru.form.field.Time", {                 //в ext-lang-ru.js вообще отсутствует время
		override: "Ext.form.field.Time",
		format: "H:i",
		minText: "Время в этом поле должно быть позже {0}",
		maxText: "Время в этом поле должно быть раньше {0}",
		invalidText: "{0} не является правильным временем"
	});
})