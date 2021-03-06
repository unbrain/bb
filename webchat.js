;(function(STK) {
	var chatDom = '<div class="WB_webim" id="WB_webchat" style="position: fixed; bottom: 0px; right: 0px; z-index: 1024;">                <div class="webim_fold webim_fold_v2 clearfix" style="top: -40px; right: 0px; visibility: visible;" node-type="chatMiniRoot" action-type="chatmini" action-data="from=chatmini" data-target="chatRoot">    	                 <div class="fold_bg"></div>    	                 <p class="fold_cont clearfix">        	                    <span class="fold_icon W_fl" data-target="minichat"></span>        	                    <em id="WB_webim_num" class="fold_font W_fl W_f14" suda-uatrack="key=weibo_chat_page&amp;value=bottom" node-type="miniContent" data-target="minichat">微博聊天</em>        	                    <span class="wchat_btn W_fr" suda-uatrack="key=weibo_chat_page&amp;value=bottom" data-target="weibochat">           	                       <em class="wchat_icon"></em>       	                    </span>    	                </p>   	                <div class="webim_hb" style="top:-10px; left:200px;display:none;" node-type="envolopeTip" action-type="getenvolope"></div>    	                <div class="W_layer W_layer_pop W_layer_pop_rg" data-target="tips" style="bottom:50px;left:0px;display:none;">        	                   <div class="content layer_mini_info">          	                      <p class="main_txt"><span class="txt">全新的聊天工具来啦！更畅快的聊天体验，猛戳试用</span></p>         	                      <div class="W_layer_arrow"><span class="W_arrow_bor W_arrow_bor_b"><i class="S_line3"></i><em class="S_bg2_br"></em></span></div>   	                   </div>  	                </div>	             </div>                  </div>';
	var dom = document.createElement('div');
	dom.innerHTML = chatDom;
	document.body.appendChild(dom);
	var oWin = null;
	var chatUrl = 'https://api.weibo.com/chat/#/?source_from=4';
	document.getElementById("WB_webchat").addEventListener("click", function(e) {
		e.preventDefault();
		oWin && oWin.close();
		oWin = null;
		oWin = window.open(chatUrl, "newhat");
		oWin.focus()
	}, false);

	function SetData(data) {
		if(data && (data.code == 1)) {
			var sendObj = {};
			var resObj = data.data;
			sendObj.time = new Date().getTime();
			sendObj.dm_pub_total = resObj.dm_pub_total || 0;
      sendObj.chat_group_client = resObj.chat_group_client || 0;
      sendObj.chat_group_notice = resObj.chat_group_notice || 0;
      if(resObj.remind_settings.msgbox == -1) {
        sendObj.allcountNum = 0;
        sendObj.msgbox = -1
			} else if((resObj.remind_settings.msgbox == 0) || (resObj.remind_settings.msgbox == 2)) {
				sendObj.allcountNum = (resObj.dm_total || 0) + (resObj.chat_group_client || 0) + (resObj.chat_group_notice || 0);
				sendObj.msgbox = 2
			} else {
				sendObj.allcountNum = (resObj.dm_total || 0) + (resObj.chat_group_client || 0) + (resObj.dm_pub_total || 0) + (resObj.chat_group_notice || 0);
				sendObj.msgbox = 0
			}
			STK.core.util.cookie.set('webim_unReadCount', JSON.stringify(sendObj), {
				'domain': '.weibo.com',
				'expire': 24
			});
			document.getElementById("WB_webim_num").innerText = sendObj.allcountNum ? '你有' + (+sendObj.allcountNum > 999 ? '999+' : sendObj.allcountNum) + '条新消息' : '微博聊天'
		}
	}
	window.__PubSub__ && window.__PubSub__.subscribe('webim.messagePushCount', SetData);
	window.__PubSub__ && window.__PubSub__.publish('webim.connected', true);

  function refreshCount(url) {
    STK.jsonp({
      url: url,
      onComplete: function (data) {
        window.__PubSub__ && window.__PubSub__.publish('webim.messagePushCount', data);
      }
    });
  }
  window.addEventListener('message', function (message) {
    if(message && message.data && (message.data.type === 'WEBCHAT_REFRESH_COUNT') && message.data.url && (message.origin === 'https://api.weibo.com')){
      refreshCount(message.data.url);
    }
  })
})(STK);
