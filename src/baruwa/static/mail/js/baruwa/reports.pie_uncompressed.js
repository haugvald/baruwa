// 
// Baruwa - Web 2.0 MailScanner front-end.
// Copyright (C) 2010  Andrew Colin Kissa <andrew@topdog.za.net>
// 
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// vim: ai ts=4 sts=4 et sw=4
//
dojo.require("dojox.charting.Chart2D");
dojo.require("dojox.charting.plot2d.Pie");
dojo.require("dojox.charting.action2d.Highlight");
dojo.require("dojox.charting.action2d.MoveSlice");
dojo.require("dojox.charting.action2d.Tooltip");
dojo.require("dojox.charting.themes.Tufte");

//functions
function build_rows(build_array){
	var rows = [];
	var count = 0;
	var c = 1;
	dojo.forEach(build_array, function(item, i){
		if (item.from_address) {
			address = item.from_address;
		};
		if (item.to_address) {
			address = item.to_address;
		};
		if (item.from_domain) {
			address = item.from_domain;
		};
		if (item.site__category) {
			address = item.site__category;
		};
		if (item.site__site) {
			address = item.site__site;
		};
		if (item.virusname) {
			address = item.virusname;
		};
		if (item.bytes) {
			address = item.bytes;
		};
		if (item.ip__hostname) {
			address = item.ip__hostname;
		};
		if (item.user__authuser) {
			address = item.user__authuser;
		};
		if (item.query) {
			address = item.query;
		};
		rows[count++] = '<div class="graph_row">';
		rows[count++] = '<div class="row_hash">'+c+'.</div>';
		rows[count++] = '<div class="row_address">';
		rows[count++] = '<div class="pie_'+c+' pie"></div>&nbsp;';
		rows[count++] = ' '+address+'</div>';
		rows[count++] = '<div class="row_count">'+item.num_count+'</div>';
		rows[count++] = '<div class="row_volume">'+filesizeformat(item.total_size)+'</div>';
		rows[count++] = '</div>';
		c++;
	});
	return rows.join('');
}

function process_response(data){
    var spinner = dojo.byId("my-spinner");
	spinner.innerHTML = gettext('Processing...........');
	if (data.success == true) {
		url = window.location.pathname;
		var links = build_filters(data.active_filters);
		dojo.empty("fhl");
		if (links != "") {
		    dojo.place(links,"fhl","last");
		    dojo.removeClass("filterrow","hide");
		}else{
		    dojo.addClass("filterrow","hide");
		};
		dojo.query("#fhl a").onclick(function(e){
		    remove_filter(e,this);
		});
		dojo.xhrGet({
			url:url,
			handleAs:"json",
			load:function(response){
				dojo.empty("graphrows");
				var rows = build_rows(response.items);
				dojo.place(rows,"graphrows","last");
				chart.updateSeries("Series A", response.pie_data);
				chart.render();
				spinner.innerHTML = '';
            	dojo.style('my-spinner','display','none');
            	dojo.attr("filter_form_submit", {'value':gettext('Add')});
            	dojo.removeAttr('filter_form_submit','disabled');
			}
		});
	}else{
		dojo.destroy('filter-error');
		dojo.create('div',{'id':"filter-error",'innerHTML':data.errors+'<div id="dismiss"><a href="#">'+gettext('Dismiss')+'</a></div>'},'afform','before');
		var timeout = setTimeout(function(){dojo.destroy('filter-error');},15050);
		dojo.query("#dismiss a").onclick(function(){clearTimeout(timeout); dojo.destroy('filter-error');});
		spinner.innerHTML = '';
    	dojo.style('my-spinner','display','none');
    	dojo.attr("filter_form_submit", {'value':gettext('Add')});
    	dojo.removeAttr('filter_form_submit','disabled');
	};
}

dojo.addOnLoad(function() {
    init_form(is_web);
    //bind to form submit
    dojo.query("#filter-form").onsubmit(function(e){
    	e.preventDefault();
    	dojo.attr("filter_form_submit", {'disabled':'disabled','value':gettext('Loading')});
    	dojo.style('my-spinner','display','block');
    	dojo.destroy('filter-error');
    	dojo.xhrPost({
    		form:"filter-form",
    		handleAs:"json",
    		load:function(data){process_response(data);},
    		headers: {"X-CSRFToken": getCookie('csrftoken')}
    	});
    });
    dojo.query("#fhl a").onclick(function(e){
        remove_filter(e,this);
    });
    //pie chart initialization and rendering
	var chart = new dojox.charting.Chart2D("chart");
	chart.setTheme(dojox.charting.themes.Tufte).addPlot("default", {
	type: "Pie",
	font: "normal normal 8pt Tahoma",
	fontColor: "black",
	labelOffset: -30,
	radius: 80
	});
	chart.addSeries("Series A", json_data);
	var anim_a = new dojox.charting.action2d.MoveSlice(chart, "default");
	var anim_b = new dojox.charting.action2d.Highlight(chart, "default");
	var anim_c = new dojox.charting.action2d.Tooltip(chart, "default");
	chart.render();
	
});