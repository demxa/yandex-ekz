$(document).ready(function(){
	var date = new Date();
	$('#sidebar').append('<span class="tlable1">Календарь</span>');
	$('#sidebar').DatePicker({
		flat: true,
		date: '2008-07-31',
		current: date.getFullYear()+'-'+(parseInt(date.getMonth())+1)+'-'+date.getDate(),
		calendars: 1,
		starts: 1,
		onChange: function(formated, dates){
			$('#evtDate').val(formated);
			if ($('#closeOnSelect input').attr('checked')) {
				$('#evtDate').DatePickerHide();
			}
		}
	});
	$('#sidebar').append('<span class="tlable1">Скоро</span>');
	$('#sidebar').append('<span class="tlable1">Скоро</span>');
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
function textNode(nodeText, nodeClass, nodeId) {
	return "<span class='"+nodeClass+"' id='"+nodeId+"'>"+nodeText+"</span>"; 
} 

function editNode(editType, editSize, editClass, editId, editEvent) {
	switch (editType) {
		case "text":
			return "<input type='text' class='"+editClass+"' id='"+editId+"' size='"+editSize[0]+"' "+editEvent+" />";
		case "textarea":
			return "<textarea class='"+editClass+"' id='"+editId+"' cols='"+editSize[0]+" rows='"+editSize[1]+"'></textarea>";
	}		
} 

function buttonNode(buttonText, buttonClass, buttonId, buttonEvent) {
	return "<input type='button' value='"+buttonText+"' class='"+buttonClass+"' id='"+buttonId+"' "+buttonEvent+" />";
}

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
function createEvt(name, date)
{
	if(date=='') alert("Пожалуйста, выберите дату события в календаре");
	else {
		var id = myStorage['events'].length+1;
		var event = { 'id':id, 'name':name, 'date':date };
		myStorage['events'].push(event);
		writeToStorage();
		console.log(myStorage['events']);
		$(':input').val('');
		$('#ok-dialog').css('padding-top',$(window).height()/2-40).html('Сохранено').fadeIn();
		setTimeout(function() {$('#ok-dialog').fadeOut();}, 1000);
		return id;
	}
}

//удаление события
function deleteEvt(id)
{
	delete myStorage['events'][id];
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

	html = "<table><tr><td class=tlable>Название события</td><td><input type=text class='tedit size-evtname' id=evtName /></td></tr><td class=tlable>Тезисы</td><td><textarea class='tedit size-tezis'></textarea></td></tr><tr><td class=tlable>Файл с презентацией</td><td class=fileload><div class=file-load-block><input type=file id=file /><div class=fileLoad><input type=text class=tedit id=fakefile value='Выбрать файл' disabled /><button class='tbutton file-button click-cursor'>Выбрать</button></div></div></td></tr><td class=tlable>Лектор</td><td><input type=text class='tedit size-lector' id=lector /></td></tr><tr><td colspan=2><button class='tbutton fine-margin click-cursor' id=createEvt>Добавить</button></td></tr></table><input type=hidden id=evtDate />";
	draw(html);
	$('#file').change(function(){

		var fileResult = $(this).attr('value');

		$('#fakefile').attr('value',fileResult);

		$('#file').hover(function(){
			$(this).parent().find('button').addClass('button-hover');
		}, function(){
			$(this).parent().find('button').removeClass('button-hover');
		});
	});
	
	$('#createEvt').click(function(){
		createEvt($('#evtName').val(),$('#evtDate').val())});
		
	
	$('#wintitle_text').html('Добавить событие');
}


 
