$(document).ready(function(){
var date = new Date();
$('#sidebar').DatePicker({
	flat: true,
	date: '2008-07-31',
	current: date.getFullYear()+'-'+(parseInt(date.getMonth())+1)+'-'+date.getDate(),
	calendars: 1,
	starts: 1
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
		$( "#window_container" ).draggable();
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

function editNode(editType, editSize, editClass, editId) {
	switch (editType) {
		case "text":
			return "<input type='text' class='"+editClass+"' id='"+editId+"' size='"+editSize[0]+"' />";
		case "textarea":
			return "<textarea class='"+editClass+"' id='"+editId+"' cols='"+editSize[0]+" rows='"+editSize[1]+"'></textarea>";
	}		
} 

function buttonNode(buttonText, buttonClass, buttonId) {
	return "<input type='button' value='"+buttonText+"' class='"+buttonClass+"' id='"+buttonId+"' />";
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
function createEvent(name, date)
{
	var id = myStorage['events'].length++;
	var event = { 'id':id, 'name':name, 'date':date };
	myStorage['events'].push(event);
	writeToStorage();
	return id;
}

//удаление события
function deleteEvent(id)
{
	delete myStorage['events'][id];
	writeToStorage();
}

//получить событие
//function getEvent(id) {
	

//отрисовывает нужную форму
function draw(html) {
$("#main").append(html);
}

//форма добавления события
function drawAddForm() {
	var html = '';
	html += textNode("Название события", "tlable", "");
	html += editNode("text", [15], "tedit", "eventName");
	html += buttonNode("Okay", "tbutton", "");
	draw(html);
}