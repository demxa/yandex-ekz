$(document).ready(function(){
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
		var date = new Date();
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
	var event = { 'name':name, 'date':date };
	myStorage['events'].push(event);
	writeToStorage();
}