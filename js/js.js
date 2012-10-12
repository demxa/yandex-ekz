$(document).ready(function(){
	var date = new Date();
	$('#sidebar').append('<span class="tlable1">Календарь</span>');
	$('#sidebar').DatePicker({
		flat: true,
		date: '2008-07-31',
		current: [date.getFullYear(),date.getMonth()+1,date.getDate()].join('-'),
		calendars: 1,
		starts: 1,
		onChange: function(formated, dates){
			$('#evtDate').val(formated);
			$('.evtDate').html(formated);
			if ($('#closeOnSelect input').attr('checked')) {
				$('#evtDate').DatePickerHide();
			}
		}
	});
	$('#sidebar').append('<span class="tlable1">Время</span><input id="evtTime" style="display:none" />');
	$(function(){
    $('#evtTime').scroller({
        preset: 'time',
        theme: 'default',
        display: 'inline',
        mode: 'scroller',
		height: 20
    }).change(function(){$('.evtTime').html($('#evtTime').val())});    
	});
	//небольшой хак, чтобы с localStorage можно было работать как с объектом
	if(isLocalStorageAvailable()) {
		if(!localStorage['storage'])
			localStorage['storage'] = '{}';	
		myStorage = JSON.parse(localStorage['storage']);
		if(!myStorage['events']) myStorage['events'] = [];
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
function createEvt(title, date, note, file, lector)
{
	var id = myStorage['events'].length;
	var event = { 'id':id, 'title':title, 'start':date, allDay:false, 'note':note, 'file':file, 'lector':lector };
	myStorage['events'].push(event);
	writeToStorage();
	console.log(myStorage['events']);
	return id;
}

//удаление события
function deleteEvt(id)
{
	myStorage['events'].splice(id,1);
	writeToStorage();
	console.log(myStorage['events']);
}


//напечатать событие
function printEvt(id,count) {
	//if(typeof(id)=='undefined')
	//	{
			for(var i in myStorage['events'])
			{
				alert(i.id);
			}
		
		//}
}
	

//отрисовывает нужную форму
function draw(html) {
$("#main").html(html);
}

//форма добавления события
function drawAddForm() {
	var html = '';

	html = "<table><tr><td class=tlable>Название события</td><td><input type=text class='tedit size-evtname' id=evtName /></td></tr><tr><td class=tlable>Дата события:</td><td class=evtDate><не указано></td></tr><tr><td class=tlable>Время события:</td><td class=evtTime><не указано></td></tr><td class=tlable>Тезисы</td><td><textarea class='tedit size-tezis' id=evtNote></textarea></td></tr><tr><td class=tlable>Файл с презентацией</td><td class=fileload><div class=file-load-block><input type=file id=file /><div class=fileLoad><input type=text class=tedit id=evtFile value='Выбрать файл' disabled /><button class='tbutton file-button click-cursor'>Выбрать</button></div></div></td></tr><td class=tlable>Лектор</td><td><input type=text class='tedit size-lector' id=evtLector /></td></tr><tr><td colspan=2><button class='tbutton fine-margin click-cursor' id=createEvt>Добавить</button></td></tr></table><input type=hidden id=evtDate />";
	draw(html);
	$('#file').change(function(){

		var fileResult = $(this).attr('value');

		$('#evtFile').attr('value',fileResult);

		$('#file').hover(function(){
			$(this).parent().find('button').addClass('button-hover');
		}, function(){
			$(this).parent().find('button').removeClass('button-hover');
		});
	});

	$('#createEvt').click(function(){
		if($('#evtDate').val()!='') {
			if($('#evtTime').val()!='') {
				var date_arr = $('#evtDate').val().split(/[-]/);
				var time_arr = $('#evtTime').val().split(/[:]/);
				var evtDate = new Date(date_arr[0],date_arr[1]-1,date_arr[2],time_arr[0],time_arr[1],0,0);
				createEvt($('#evtName').val(), evtDate, $('#evtNote').val(), $('#evtFile').val(), $('#evtLector').val());
					$('#ok-dialog').css('padding-top',$(window).height()/2-40).html('Сохранено').fadeIn();
					setTimeout(function() {$('#ok-dialog').fadeOut();}, 1000);
					$(':input').val('');
					$('.evtDate, .evtTime').html('<не указано>');
			}
			else alert('Укажите время события');
		}
		else alert('Укажите дату события');
		
		$('#wintitle_text').html('Добавить событие');
	});
}

//форма просмотра календаря
function drawViewForm() {
	var html = '';

	html = "<div id='calendar'></div>";
	draw(html);
	
	$('#calendar').fullCalendar({
			eventClick: function(e) {
				drawEditForm(e.id)
			},
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			editable: false,
			timeFormat: 'H(:mm)',
			events: myStorage['events']
		});
		
	$('#wintitle_text').html('Календарь событий');
}

//форма изменения события
function drawEditForm(id) {
	var html = '';

	html = "<table><tr><td class=tlable>Название события</td><td><input type=text class='tedit size-evtname' id=evtName /></td></tr><tr><td>Дата события:</td><td class=evtDate><не указано></td></tr><tr><td>Время события:</td><td class=evtTime><не указано></td></tr><td class=tlable>Тезисы</td><td><textarea class='tedit size-tezis' id=evtNote></textarea></td></tr><tr><td class=tlable>Файл с презентацией</td><td class=fileload><div class=file-load-block><input type=file id=file /><div class=fileLoad><input type=text class=tedit id=evtFile value='Выбрать файл' disabled /><button class='tbutton file-button click-cursor'>Выбрать</button></div></div></td></tr><td class=tlable>Лектор</td><td><input type=text class='tedit size-lector' id=evtLector /></td></tr><tr><td colspan=2><button class='tbutton fine-margin click-cursor' id=createEvt>Изменить</button></td></tr></table><input type=hidden id=evtDate />";
	draw(html);
	var date = new Date(myStorage['events'][id]['start']);
	$('#evtName').val(myStorage['events'][id]['title']);
	$('#evtNote').val(myStorage['events'][id]['note']);
	$('#evtFile').val(myStorage['events'][id]['file']);
	$('#evtLector').val(myStorage['events'][id]['lector']);
	$('.evtDate').html([date.getFullYear(),parseInt((date.getMonth()<9?'0':'')+date.getMonth())+1,(date.getDate()<10?'0':'')+date.getDate()].join('-'));
	$('.evtTime').html([(date.getHours()<10?'0':'')+date.getHours(),(date.getMinutes()<10?'0':'')+date.getMinutes()].join(':'));
	$('#evtDate').val($('.evtDate').html());
	$('#evtTime').val($('.evtTime').html());
	$('#file').change(function(){

		var fileResult = $(this).attr('value');

		$('#evtFile').attr('value',fileResult);

		$('#file').hover(function(){
			$(this).parent().find('button').addClass('button-hover');
		}, function(){
			$(this).parent().find('button').removeClass('button-hover');
		});
	});

	$('#createEvt').click(function(){
		if($('#evtDate').val()!='') {
			if($('#evtTime').val()!='') {
				var date_arr = $('#evtDate').val().split(/[-]/);
				var time_arr = $('#evtTime').val().split(/[:]/);
				var evtDate = new Date(date_arr[0],date_arr[1]-1,date_arr[2],time_arr[0],time_arr[1],0,0);
				deleteEvt(id);
				createEvt($('#evtName').val(), evtDate, $('#evtNote').val(), $('#evtFile').val(), $('#evtLector').val());
			}
			else alert('Укажите время события');
		}
		else alert('Укажите дату события');
		
		$('#wintitle_text').html('Редактирование события');
	});
}
