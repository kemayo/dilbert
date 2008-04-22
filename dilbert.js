$(function() {
	var current, data, first;
	var domain = "http://dilbert.com";
	var data = {};
	var week;
	function setupViewer() {
		$('#viewer').empty()
			.append($('<div class="mainview"><span id="prevday" class="navlink">&lsaquo;</span><div id="stripholder"><img id="strip" src="default.gif"/></div><span id="nextday" class="navlink">&rsaquo;</span></div>'))
			.append($('<div class="infoview"><span id="first" class="navlink" title="First">&laquo;</span><span id="info">Loading</span><span id="last" class="navlink" title="Last">&raquo;</span></div>'))
			.append($('<div class="subview"><span id="prevweek" class="navlink">&laquo;</span><ol id="weekview"/><span id="nextweek" class="navlink">&raquo;</span></div>'))
		for(var i=0; i<7; i++) {
			$('#weekview').append($('<li class="day'+i+'"><img src="default_th.gif"/></li>'))
		}
		$('#weekview li').click(function() { setCurrent($(this).prevAll().size()); });
		$('#prevday').click(function() {
			var h = $('#stripholder').get(0);
			if((h.scrollWidth > h.clientWidth) && (h.scrollLeft > 0)) {
				h.scrollLeft -= (h.clientWidth - 10);
			} else {
				setCurrent(current - 1);
			}
		});
		$('#nextday').click(function() {
			var h = $('#stripholder').get(0);
			if((h.scrollWidth > h.clientWidth) && (h.scrollLeft < (h.scrollWidth - h.clientWidth))) {
				h.scrollLeft += (h.clientWidth - 10);
			} else {
				setCurrent(current + 1);
			}
		});
		$('#prevweek').click(function() { setCurrent(current - 7); });
		$('#nextweek').click(function() { setCurrent(current + 7); });
		$('#first').click(function() {
			goToDate(first);
		});
		$('#last').click(function() { goToDate(new Date()); });
		$.datepicker.setDefaults({mandatory: true, dateFormat: 'D M d, yy'});
		$('#info').click(function() { $.datepicker.dialogDatepicker($(this).text(), goToDate); });
	}
	function setDay(i) {
		var strip = $(this);
		$('.day'+i+' img')
			.attr('src', domain + strip.find('URL_FirstPanel').text())
			.attr('title', strip.find('StripID').text()+': '+strip.attr('Date'));
	}
	function setCurrent(to) {
		if(to < 0) {
			current = 7 + to;
			week.setDate(week.getDate() - 7);
			return loadWeek(week);
		} else if (to > 6) {
			current = to - 7;
			week.setDate(week.getDate() + 7);
			return loadWeek(week);
		} else {
			if(to != 0) {
				to = (to != undefined) && to || parseInt($(data[week.toString()]).find('CurrentDay').text());
			}
			var strip = $(data[week.toString()]).find('Day').eq(to);
			$('#strip')
				.attr('src', domain + strip.find('URL_Strip').text())
				.attr('title', strip.find('StripID').text()+': '+strip.attr('Date'));
			$('#weekview li').removeClass('current').filter('.day'+to).addClass('current');
			$('#info').text(strip.attr('Date'));
			current = to;
		}
	}
	function stringToFirstDay(sdate) {
		var d = new Date(sdate);
		var day = d.getDay() - 1; // Mon==0 in feed
		d.setDate(d.getDate() - day);
		return [d, day];
	}
	function goToDate(sdate) {
		var d = stringToFirstDay(sdate);
		current = d[1];
		loadWeek(d[0]);
	}
	function loadSuccess(d) {
		data[week.toString()] = d
		domain = 'http://'+$(d).find('Domain').text();
		setCurrent(current);
		$(d).find('Day').each(setDay);
		var f = $(d).find('FirstDay').text();
		if(first != f) {
			first = f;
			$('#datepicker').changeDatepicker({minDate: new Date(f)});
		}
	}
	function loadWeek(d) {
		//week = (offset && offset >= 0) && offset || 0;
		week = d;
		if(!data[week.toString()]) {
			var source;
			$.ajax({
				'url': 'xmlproxy.php?url=http://dilbert.com/xml/widget.daily/?'+encodeURIComponent('Year='+d.getFullYear()+'&Month='+(d.getMonth() + 1)+'&Day='+d.getDate()),
				'dataType': 'xml',
				'success': loadSuccess
			})
		} else {
			loadSuccess(data[week.toString()]);
		}
	}
	setupViewer();
	goToDate(new Date());
});
