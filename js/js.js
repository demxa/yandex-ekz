$(document).ready(function(){
	var date = new Date();
	$('#leftCalendar').DatePicker({
		flat: true,
		date: [date.getFullYear(),date.getMonth()+1,date.getDate()].join('-'),
		current: [date.getFullYear(),date.getMonth()+1,date.getDate()].join('-'),
		calendars: 1,
		starts: 1,
		onChange: function(formated, dates){
			$('#evtDate, #editEvtDate').val(formated);
			$('.evtDate, .editEvtDate').html(formated);
		}
	});	
	$(function(){
    $('#evtTime').scroller({
        preset: 'time',
        theme: 'default',
        display: 'inline',
        mode: 'scroller',
		height: 20
    }).change(function(){ 
			if($('#evtTimeStart, #editEvtTimeStart').attr('focus')==1) $('#evtTimeStart, #editEvtTimeStart').val($('#evtTime').val());
			if($('#evtTimeEnd, #editEvtTimeEnd').attr('focus')==1) $('#evtTimeEnd, #editEvtTimeEnd').val($('#evtTime').val());
			if($('#editEvtTimeStart').attr('focus')==1) $('#editEvtTimeStart').val($('#evtTime').val());
			if($('#editEvtTimeEnd').attr('focus')==1) $('#editEvtTimeEnd').val($('#evtTime').val());
		});    
	});
	//небольшой хак, чтобы с localStorage можно было работать как с объектом
	if(isLocalStorageAvailable()) {
		if(!localStorage['storage'])
			localStorage['storage'] = '{}';	
		myStorage = JSON.parse(localStorage['storage']);
		if(!myStorage['events']) myStorage['events'] = [];
		if(!myStorage['freeid']) myStorage['freeid'] = 0;
	}
	else alert('Ваш браузер устарел. Данное веб-приложение не сможет работать на старой версии браузера. Пожалуйста, обновитесь'); //TODO: сделать отображение через DOM
	//день недели как на маке
    (function(){
		wday = [];
		wday[0]="Вс"
		wday[1]="Пн"
		wday[2]="Вт"
		wday[3]="Ср"
		wday[4]="Чт"
		wday[5]="Пт"
		wday[6]="Сб"
        var time = wday[date.getDay()]+', '+(date.getHours()<10?'0':'')+date.getHours()+':'+(date.getMinutes()<10?'0':'')+date.getMinutes();
        $("#date").html(time);
        window.setTimeout(arguments.callee, 1000);
    })();
	//чтобы можно было двигать окошко
	$(function() {
		$( "#window_container" ).draggable({ handle: "#wintitle" });
		$( ".infoTip" ).draggable({ containment: "document" });
	});
	//анимация кнопок окна
	$(".winbutton").each(function() {
		$(this).mouseover(function() {
			$(this).attr('src',$(this).attr('src').replace(".png","_l.png"));
		});
		$(this).mouseout(function() {
			$(this).attr('src',$(this).attr('src').replace("_l",""));
		});
	});
	//$('a[href=#home]').click(drawHomeForm);
	$('a[href=#calendar]').click(drawViewForm);
	$('a[href=#add]').click(drawAddForm);
	//$('a[href=#hz]').click(drawHzForm);
	$('a[href=#import]').click(drawImportForm);
	$('a[href=#export]').click(drawExportForm);
	$('#ya').click(function() { $(location).attr('href', 'http://www.yandex.ru') });
	$('.closeMe').click(function() {
		$('.infoTip').hide();
	});
	$('#infoEditEvt').click(function() {
		drawEditForm();
	});
	$('#infoDeleteEvt').click(function() {
		deleteEvt($('#editId').val());
		drawViewForm();
		clearInfoTip();
	});
	clearInfoTip();
	
});

//localStorage.removeItem('storage');


//поддерживает ли клиент localStorage?
function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

//функция записи в localStorage
function writeToStorage() {
	if(myStorage) localStorage['storage'] = JSON.stringify(myStorage);
	else alert('Хранилище пусто'); //TODO: сделать нормальную обработку
}

//функция создания базового события в календаре
function createEvt(title, start, end, note, file, lector) {
	var event;
	if (arguments.length === 1) {
		event = arguments[0];
		event.id = myStorage['freeid'];
		event.allDay = false;
	}
	else if (arguments.length === 6) {
		event = { 'id':myStorage['freeid'], 'title':title, 'start':start, 'end':end, allDay:false, 'note':note, 'file':file, 'lector':lector };
	}
	else return false;
	myStorage['events'][myStorage['freeid']] = event;
	myStorage['freeid'] = myStorage['events'].length;
	writeToStorage();
	console.log(myStorage['events']);
	return event.id;
}

//удаление события
function deleteEvt(id) {
	delete(myStorage['events'][id]);
	myStorage['freeid'] = id;
	writeToStorage();
	console.log(myStorage['events']);
}

//форма добавления события
function drawAddForm() {
	$('.tab').hide();
	$('#createEvent').show();
	$('textarea,:input[type=text]').val('');
	$('#file').change(function(){

		var fileResult = $(this).attr('value');

		$('#evtFile').attr('value',fileResult).data('selected', true);

		$('#file').hover(function(){
			$(this).parent().find('button').addClass('button-hover');
		}, function(){
			$(this).parent().find('button').removeClass('button-hover');
		});
	});
	$('#evtTimeStart, #evtTimeEnd').focus(function(){ 
		$(this).attr('focus',1);  
	}).blur(function(){ 
		$(this).attr('focus',0); 
	});

	$('#createEvt').click(function(){

			var fullMinutes = (new Date()).getTimezoneOffset();
			var hours = Math.floor(Math.abs(fullMinutes / 60));
			var minutes = Math.abs(fullMinutes % 60);
			var offset = (fullMinutes >= 0 ? '-' : '+') + (hours > 9 ? '' : '0') + hours + (minutes > 9 ? ':' : ':0') + minutes;

		if($('#evtDate').val()!='') {
			if($('#evtTimeStart').val()!='' && $('#evtTimeEnd').val()!='') {
				var startDateStr = (new Date($('#evtDate').val()+'T'+$('#evtTimeStart').val()+':00'+offset)).toString();
				var endDateStr = (new Date($('#evtDate').val()+'T'+$('#evtTimeEnd').val()+':00'+offset)).toString();
				createEvt($('#evtName').val(), startDateStr, endDateStr, $('#evtNote').val(), $('#evtFile').val(), $('#evtLector').val());
					$('#ok-dialog').css('padding-top',$(window).height()/2-40).html('Сохранено').fadeIn();
					setTimeout(function() {$('#ok-dialog').fadeOut();}, 1000);
					$('textarea, :input[type=text]').val('');
					$('.evtDate').html('<не указана>');
			}
			else alert('Укажите время события');
		}
		else alert('Укажите дату события');
		
		$('#wintitle_text').html('Добавить событие');
	});
}

//форма просмотра календаря
function drawViewForm() {
	var allEvents = [];
	$.extend(true,allEvents,myStorage['events']);
	console.log(allEvents);
	$('.tab').hide();
	$('#calendar').fullCalendar('destroy');
	$('#calendar').show().fullCalendar({
			eventClick: function(e) {
				$('#editId').val(e.id);
				drawInfoTip();
			},
			dayClick: function(date, allDay, jsEvent, view) {
				drawAddForm();
				var evtTime = humanTime(date,date);
				$('#leftCalendar').DatePickerSetDate(evtTime[0], true);
				$('.evtDate').html(evtTime[0]);
				$('#evtDate').val(evtTime[0]);
			},
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			editable: false,
			timeFormat: 'H(:mm)',
			events: allEvents
		});
		console.log(allEvents);
	$('#wintitle_text').html('Календарь событий');
}

//форма изменения события
function drawEditForm() {
	var id = $('#editId').val();
	$('.tab').hide();
	$('#editEvent').show();
	var evtTime = humanTime(myStorage['events'][id]['start'],myStorage['events'][id]['end']);
	$('#editEvtName').val(myStorage['events'][id]['title']);
	$('#editEvtNote').val(myStorage['events'][id]['note']);
	$('#editEvtFile').val(myStorage['events'][id]['file']);
	$('#editEvtLector').val(myStorage['events'][id]['lector']);
	$('.editEvtDate').html(evtTime[0]);
	$('#editEvtTimeStart').val(evtTime[1]);
	$('#editEvtTimeEnd').val(evtTime[2]);
	$('#editEvtDate').val($('.editEvtDate').html());
	$('#editFile').change(function(){

		var fileResult = $(this).attr('value');

		$('#editEvtFile').attr('value',fileResult);

		$('#editFile').hover(function(){
			$(this).parent().find('button').addClass('button-hover');
		}, function(){
			$(this).parent().find('button').removeClass('button-hover');
		});
	});
	$('#editEvtTimeStart, #editEvtTimeEnd').focus(function(){ 
		$(this).attr('focus',1);  
	}).blur(function(){ 
		$(this).attr('focus',0); 
	});
	$('#editEvt').click(function(){

		var fullMinutes = (new Date()).getTimezoneOffset();
		var hours = Math.floor(Math.abs(fullMinutes / 60));
		var minutes = Math.abs(fullMinutes % 60);
		var offset = (fullMinutes >= 0 ? '-' : '+') + (hours > 9 ? '' : '0') + hours + (minutes > 9 ? ':' : ':0') + minutes;

		if($('#editEvtDate').val()!='') {
			if($('#editEvtTimeStart').val()!='' && $('#editEvtTimeEnd').val()!='') {
				var startDateStr = (new Date($('#editEvtDate').val()+'T'+$('#editEvtTimeStart').val()+':00'+offset)).toString();
				var endDateStr = (new Date($('#editEvtDate').val()+'T'+$('#editEvtTimeEnd').val()+':00'+offset)).toString();
				deleteEvt($('#editId').val());
				createEvt($('#editEvtName').val(), startDateStr, endDateStr, $('#editEvtNote').val(), $('#editEvtFile').val(), $('#editEvtLector').val());
					drawInfoTip();
					drawViewForm()
					$('#ok-dialog').css('padding-top',$(window).height()/2-40).html('Изменено').fadeIn();
					setTimeout(function() {$('#ok-dialog').fadeOut();}, 1000);
			}
			else alert('Укажите время события');
		}
		else alert('Укажите дату события');
	});
		$('#wintitle_text').html('Редактирование события');
}

function drawExportForm() {
	$('.tab').hide();
	$('#export').show();
	$('#evtExportCode').val(exportIcs(myStorage));
	$('#evtExport').click(function() {
		$('body').append($('<iframe />', {'src': 'data:text/calendar;charset=utf-8,' + encodeURIComponent(exportIcs(myStorage))}).ready(function(){
			$(this).remove();
		}));
	});
}

function drawImportForm() {
	$('.tab').hide();
	$('#import').show();
	$('#evtImport').click(function() {
		var event;
		var v = $('#evtImportCode').val().split("\n");
		localStorage.removeItem('storage');
		myStorage['events'] = [];
		myStorage['freeid'] = 0;
		for (var i = 0; i < v.length; i++) {
			var pos = v[i].indexOf(':');
			var key = v[i].substring(0, pos);
			var value = v[i].substring(pos + 1, v[i].length);
			if(value=='VCALENDAR') continue;
			switch (key) {
				case 'BEGIN':
					if (value == 'VEVENT')
						event = { id:0, title:'', start:'', end:'', note:'', file:'', lector:'' };
					break;
				case 'DESCRIPTION':
					event.note = value.split("\\n").join('<br>');
					break;
				case 'DTSTART':
					event.start = (new Date(value.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}).*/, '$1-$2-$3T$4:$5:$6'))).toString();
					break;
				case 'DTEND':
					event.end = (new Date(value.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}).*/, '$1-$2-$3T$4:$5:$6'))).toString();
					break;
				case 'SUMMARY':
					event.title = value;
					break;
				case 'X-LECTOR':
					event.lector = value;
					break;
				case 'X-FILE':
					event.file = value;
					break;
				case 'END':
					if (value == 'VEVENT')
						createEvt(event);
					break;
			}
		}
	});
}

function drawInfoTip() {
	var id = $('#editId').val();
	var evtTime = humanTime(myStorage['events'][id]['start'],myStorage['events'][id]['end']);
	$('#infoEvtName').html(myStorage['events'][id].title);
	$('#infoEvtDate').html(evtTime[0]+', c '+evtTime[1]+' до '+evtTime[2]);
	$('#infoEvtTezis').html(myStorage['events'][id].note);
	$('#infoEvtFile').html((myStorage['events'][id].file!==''?'<a href="'+myStorage['events'][id].file+'">Презентация</a>':''));
	$('#infoEvtLector').html((myStorage['events'][id].lector!=''?'Лекцию читает: '+myStorage['events'][id].lector:''));
	$('.modifyLink').show();
	$('.tlable2').hide();
}

function clearInfoTip() {
	$('.tlable2').show();
	$('#infoEvtName, #infoEvtDate, #infoEvtTezis, #infoEvtFile, #infoEvtLector').html('');
	$('.modifyLink').hide();
}

function formatDate(d) {
	if (typeof d === 'string') d = new Date(d);
	return d.getUTCFullYear() +
	(d.getUTCMonth() < 9 ? '0' : '') + (d.getUTCMonth() + 1) +
	(d.getUTCDate() < 10 ? '0' : '') + d.getUTCDate() +'T' +
	(d.getUTCHours() < 10 ? '0' : '') + d.getUTCHours() +
	(d.getUTCMinutes() < 10 ? '0' : '') + d.getUTCMinutes() + "00Z";
}

function humanTime(sd,ed)  {
	var startDate = new Date(sd);
	var endDate = new Date(ed);
	var date = [startDate.getFullYear(),parseInt((startDate.getMonth()<9?'0':'')+startDate.getMonth())+1,(startDate.getDate()<10?'0':'')+startDate.getDate()].join('-');
	var startTime = [(startDate.getHours()<10?'0':'')+startDate.getHours(),(startDate.getMinutes()<10?'0':'')+startDate.getMinutes()].join(':');
	var endTime = [(endDate.getHours()<10?'0':'')+endDate.getHours(),(endDate.getMinutes()<10?'0':'')+endDate.getMinutes()].join(':');
	return [date,startTime,endTime];
}

function exportIcs(storage) {
	var ics = "BEGIN:VCALENDAR\n\
PRODID:YANDEX\n\
VERSION:2.0\n\
METHOD:PUBLISH\n";

	for (var i in storage.events) {
		if (!storage.events.hasOwnProperty(i)) continue;
		var dtstart = i['start'];
		if (typeof dtstart === 'undefined') continue;
		var dtend = new Date(dtstart);
		dtend.setUTCHours(dtend.getUTCHours() + 1);
		var ics_event = "BEGIN:VEVENT\n\
DESCRIPTION:" + (typeof storage.events[i].note === 'undefined' ? '' : storage.events[i].note.replace(/\r?\n/g, '\\n')) + "\n\
DTEND:" + formatDate(dtend) + "\n\
DTSTART:" + formatDate(dtstart) + "\n\
LOCATION:Яндекс\n\
SUMMARY:" + (typeof storage.events[i].title === 'undefined' ? '' : storage.events[i].title) + "\n" +
(typeof storage.events[i].lector === 'undefined' ? '' : 'X-LECTOR:' + storage.events[i].lector + "\n") +
(typeof storage.events[i].file === 'undefined' ? '' : 'X-FILE:' + storage.events[i].file + "\n") +
"BEGIN:VALARM\n\
TRIGGER:-PT15M\n\
ACTION:DISPLAY\n\
END:VALARM\n\
END:VEVENT\n";
		ics += ics_event;
	}

	ics += "END:VCALENDAR";
	return ics;
}

