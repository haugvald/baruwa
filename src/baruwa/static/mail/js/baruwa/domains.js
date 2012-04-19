function ajax_start(){$(this).append("&nbsp;Processing...").show();if($("#in-progress").length){$("#in-progress").remove()}$("#Footer_container").after(loading_msg)}function ajax_stop(){$(this).empty().hide();$("#loading_message").remove()}function ajax_error(c,b,a){if(b.status==200){location.href=a.url}else{$(this).empty().append('<span class="ajax_error">'+gettext("Error connecting to server. check network!")+"</span>").show();$(".Grid_heading").before('<div id="ajax-error-msg" class="ui-state-highlight">'+gettext("Server error")+"</div>");setTimeout(function(){$("#ajax-error-msg").empty().remove()},3900)}$("#loading_message").remove()}function navigate(){window.scrollTo(0,0);url=$(this).attr("href").replace(/\//g,"-").replace(/^-/,"").replace(/-$/,"");$.address.value("?u="+url);$.address.history($.address.baseURL()+url);$.getJSON($(this).attr("href"),page_from_json);return false}function paginate(){fmt=gettext("Showing page %(page)s of %(pages)s pages.");data={page:rj.page,pages:rj.pages};tmp=interpolate(fmt,data,true);$("#heading").empty().append(tmp);$.address.title(tmp);count=0;row=[];row[count++]=tmp;if(rj.show_first){row[count++]='<span><a href="/'+rj.app+"/1/"+rj.direction+"/"+rj.order_by+'/">';row[count++]='<img src="'+media_url+'mail/imgs/first_pager.png" alt="First"/></a></span>';row[count++]="<span>.....</span>"}if(rj.has_previous){row[count++]='<span><a href="/'+rj.app+"/"+rj.previous+"/"+rj.direction+"/"+rj.order_by+'/">';row[count++]='<img src="'+media_url+'mail/imgs/previous_pager.png" alt="Previous"/></a></span>'}$.each(rj.page_numbers,function(a,b){li="/"+rj.app+"/"+b+"/"+rj.direction+"/"+rj.order_by+"/";if(rj.page==b){row[count++]="<span><b>"+b+"</b>&nbsp;</span>"}else{row[count++]='<span><a href="'+li+'">'+b+"</a>&nbsp;</span>"}});if(rj.has_next){row[count++]='<span><a href="/'+rj.app+"/"+rj.next+"/"+rj.direction+"/"+rj.order_by+'/">';row[count++]='<img src="'+media_url+'mail/imgs/next_pager.png" alt="Next"/></a></span>'}if(rj.show_last){row[count++]="<span>......</span>";row[count++]='<a href="/'+rj.app+"/last/"+rj.direction+"/"+rj.order_by+'/">';row[count++]='<img src="'+media_url+'mail/imgs/last_pager.png" alt="Last"/></a></span>'}$("#paginator").html(row.join(""));$("#paginator span a").bind("click",navigate)}function confirm_delete(a){a.preventDefault();$(this).blur();re=/\/accounts\/delete\/address\/([0-9]+)/;l=$(this).attr("href");m=l.match(re);if(m){del_warning=[];count=0;del_warning[count++]='<div id="confirm-del-msg">';del_warning[count++]='<div id="confirm-del-info">';del_warning[count++]=gettext("This will delete the domain ");del_warning[count++]=gettext("and all associated data. This action is not reversible")+"</div>";del_warning[count++]='<div id="confirm-del-buttons">';del_warning[count++]=gettext("Do you wish to continue ?");del_warning[count++]='&nbsp;<input type="button" value="Yes" id="yes_del" />&nbsp;';del_warning[count++]='<input type="button" value="No" id="no_del" />';del_warning[count++]="</div>";del_warning[count++]="</div>";if($("#confirm-del-msg").length){$("#confirm-del-msg").remove()}$("#domain-id-"+m[1]).after(del_warning.join(""));$("#no_del").bind("click",function(b){b.preventDefault();$("#confirm-del-msg").remove()});$("#yes_del").bind("click",function(b){b.preventDefault();$("#confirm-del-msg").remove();$.post(l,{id:m[1]},function(c){if(c.success){$("#domain-id-"+m[1]).remove();$(".Grid_content").before('<div id="in-progress">'+c.html+"</div>");$("#in-progress").append('<div id="dismiss"><a href="#">'+gettext("Dismiss")+"</a></div>");ip=setTimeout(function(){$("#in-progress").remove()},15050)}else{$(".Grid_content").before('<div id="in-progress">'+c.html+"</div>");$("#in-progress").append('<div id="dismiss"><a href="#">'+gettext("Dismiss")+"</a></div>");ip=setTimeout(function(){$("#in-progress").remove()},15050)}$("#dismiss a").click(function(d){d.preventDefault();clearTimeout(ip);$("#in-progress").empty().remove()})},"json")})}}function page_from_json(a){if(a){rj=a.paginator;row=[];count=0;css="DarkGray";$.each(a.items,function(b,c){if(css=="LightBlue"){css="LightGray"}else{css="LightBlue"}if(c.enabled){img='<img src="'+media_url+'mail/imgs/active.png" alt="" />';eimg='<img src="'+media_url+'mail/imgs/tick.png" alt="" />'}else{img='<img src="'+media_url+'mail/imgs/inactive.png" alt="" />';eimg='<img src="'+media_url+'mail/imgs/minus.png" alt="" />'}row[count++]='<div id="domain-id-'+c.id+'" class="'+css+'_div">';row[count++]='<div class="Domains_hash">'+img+"</div>";row[count++]='<div class="Domains_name"><a href="/settings/domains/'+c.id+'/">';row[count++]=" "+c.address+"</a></div>";row[count++]='<div class="Domains_owner"><a href="/accounts/user/'+c.user__id+'/">';row[count++]=" "+c.user__first_name+" "+c.user__last_name+" ("+c.user__username+")</a>";row[count++]='</div><div class="Domains_status">'+eimg+"</div>";row[count++]='<div class="Domains_action"><div class="Domains_action_edit">';row[count++]='<a href="/accounts/edit/address/'+c.id+'/">';row[count++]='<img src="'+media_url+'mail/imgs/edit.png" alt="Edit" title="Edit" /></a></div>';row[count++]='<div class="Domains_action_delete">';row[count++]='<a href="/accounts/delete/address/'+c.id+'/">';row[count++]='<img src="'+media_url+'mail/imgs/action_delete.png" alt="Delete" title="Delete" /></a>';row[count++]="</div></div></div>"});if(row.length){$("div.Grid_heading").siblings("div").remove();$("div.Grid_heading").after(row.join(""))}else{$("div.Grid_heading").siblings("div").remove();$("div.Grid_heading").after('<div class="LightBlue_div"><div class="spanrow">'+gettext("No domains at the moment")+"</div></div>")}$("div.Domains_action_delete a").bind("click",confirm_delete);paginate()}}function handlextern(){page=$.address.parameter("u");if(page){window.scrollTo(0,0);page=$.trim(page);re=/^mail-settings\-[0-9]+\-dsc|asc\-id|address$/;if(re.test(page)){page=page.replace(/-/g,"/");url="/"+page+"/";$.get(url,function(a){page_from_json(a)},"json")}}return false}function jsize_page(){$("#my-spinner").ajaxStart(ajax_start).ajaxStop(ajax_stop).ajaxError(ajax_error);$("#paginator span a").bind("click",navigate);$.address.externalChange(handlextern);$("div.Domains_action_delete a").bind("click",confirm_delete)}var loading_msg='<div id="loading_message"><div id="loading"><img src="'+media_url+'mail/imgs/ajax-loader.gif" alt="loading"/><br/><b>'+gettext("Processing")+"</b></div></div>";$(document).ready(jsize_page);