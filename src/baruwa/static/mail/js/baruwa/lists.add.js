function handle_form(b){b.preventDefault();if($("#id_user_part").length){var a={from_address:$("#id_from_address").val(),to_address:$("#id_to_address").val(),list_type:$("#id_list_type").val(),user_part:$("#id_user_part").val()}}else{var a={from_address:$("#id_from_address").val(),to_address:$("#id_to_address").val(),list_type:$("#id_list_type").val()}}$.post($("#list-form").attr("action"),a,function(c){if(c.success){if($("#info-msg").length){clearTimeout(timeout);$("#info-msg").remove()}if($("#filter-error").length){clearTimeout(timeout);$("#filter-error").remove()}$("#above-msgs").after('<div id="info-msg">'+gettext("The address has been added to the list")+"</div>");$("#info-msg").append('<div id="dismiss"><a href="#">'+gettext("Dismiss")+"</a></div>");timeout=setTimeout(function(){$("#info-msg").empty().remove()},15050);$("form").clearForm();window.scroll(0,0);$("#dismiss a").click(function(e){e.preventDefault();clearTimeout(timeout);$("#info-msg").empty().remove()})}else{var d="#id_"+c.form_field;$(d).addClass("input_error");if($("#filter-error").length){clearTimeout(timeout);$("#filter-error").remove()}if($("#info-msg").length){clearTimeout(timeout);$("#info-msg").remove()}$("#above-msgs").after('<div id="filter-error">'+c.error_msg+"</div>");$("#filter-error").append('<div id="dismiss"><a href="#">'+gettext("Dismiss")+"</a></div>");timeout=setTimeout(function(){$("#filter-error").empty().remove();$(d).removeClass("input_error")},15050);window.scroll(0,0);$("#dismiss a").click(function(e){e.preventDefault();clearTimeout(timeout);$("#filter-error").empty().remove();$(d).removeClass("input_error")})}},"json")}$(document).ready(function(){$("#list-form").submit(handle_form);$("#my-spinner").ajaxStart(function(){$(this).empty().append(gettext("Processing....")).show()}).ajaxError(function(c,b,a){$(this).hide();$(".Bayes_heading").after('<div id="filter-error">'+gettext("Server Error occured")+"</div>");$("#filter-error").append('<div id="dismiss"><a href="#">'+gettext("Dismiss")+"</a></div>");timeout=setTimeout(function(){$("#filter-error").empty().remove()},15050);$("#dismiss a").click(function(d){d.preventDefault();clearTimeout(timeout);$("#filter-error").empty().remove()})}).ajaxStop(function(){$(this).hide()})});