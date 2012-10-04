$(document).ready(function(){
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
	$(function() {
		$( "#window_container" ).draggable();
	});
	$(".winbutton").each(function() {
		$(this).mouseover(function() {
			$(this).attr('src',$(this).attr('src').replace(".png","_l.png"));
		});
		$(this).mouseout(function() {
			$(this).attr('src',$(this).attr('src').replace("_l",""));
		});
	});
});
