function distance(x0, y0, x1, y1) {
	var xDiff = x1-x0;
	var yDiff = y1-y0;
	
	return Math.sqrt(xDiff*xDiff + yDiff*yDiff);
}

$(document).ready(function() {
	var proximity = 180;
	var iconSmall = 48, iconLarge = 128; //пограничные значения иконок
	var iconDiff = (iconLarge - iconSmall);
	var mouseX, mouseY;
	var dock = $("#dock");
	var animating = false, redrawReady = false;
		
	$(document.body).removeClass("no_js");
	
	$(document).bind("mousemove", function(e) {
		if (dock.is(":visible")) {
			mouseX = e.pageX;
			mouseY = e.pageY;
		
			redrawReady = true;
			registerConstantCheck();
		}
	});
	
	function registerConstantCheck() {
		if (!animating) {
			animating = true;
			
			window.setTimeout(callCheck, 15);
		}
	}
	
	function callCheck() {
		sizeDockIcons();
		
		animating = false;
	
		if (redrawReady) {
			redrawReady = false;
			registerConstantCheck();
		}
	}
	
	//просчет ресайза иконок
	function sizeDockIcons() {
		dock.find("li").each(function() {
			//расстояние от центра кажой иконки
			var centerX = $(this).offset().left + ($(this).outerWidth()/2.0);
			var centerY = $(this).offset().top + ($(this).outerHeight()/2.0);
			
			var dist = distance(centerX, centerY, mouseX, mouseY);
			
			//просчет размера иконки в зависимости от удаления курсора от центра иконки
			var newSize =  (1 - Math.min(1, Math.max(0, dist/proximity))) * iconDiff + iconSmall;
			$(this).find("a").css({width: newSize});
		});
	}
});