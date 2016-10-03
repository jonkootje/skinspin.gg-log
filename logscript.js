var idlist = {};
var logblock = null;
function init() {
    document.body.innerHTML += '<div id="log" style="background-color: black; color: white; padding: 10px; overflow-y: auto; position: fixed; z-index: 999999; top: 0px; right: 0px; width: 500px; height: 150px;"></div>';
    logblock = document.getElementById('log');
    return true;
}

function log(message) {
    logblock.innerHTML += '<span style="display: block; color: white; font-family: Arial;">' + message + '</span>';
    logblock.scrollTop = logblock.scrollHeight;
    return true;
}

function debug(data) {
    log('CHAT [' + data.socket.steam_name + ' // ' + data.socket.create_ip + ' // ' + data.socket.id + '] ' + data.message);
    idlist[data.socket.id] = data.socket.steam_name;

    //log(data);
}


server.on('send private', function(userid, t, msg) {
	// var type = [
	// 	'success',
	// 	'info',
	// 	'warn',
	// 	'error'
	// ];
	//
	// if (window.id == userid)
	// {
	// 	$.notify(msg, type[t]);
	// }
    var type = [
		'success',
		'info',
		'warn',
		'error'
	];


    if (idlist[userid] == undefined) {
        log('MESSAGE [' + userid + ' // ' + type[t] + '] ' + msg);
    } else {
        log('MESSAGE [' + idlist[userid] + ' // ' + type[t] + '] ' + msg);

    }
});

chat.on('new message', function(data){
    debug(data);
});

function addUserToRound(user) {
    log(user);
    e = $("#events");
	$(
		'<div class="animated slideInLeft">' +
		'<div class="event event-update" style="border-left: 3px solid ' + colorArr[user.color] + ' !important; border-right: 3px solid ' + colorArr[user.color] + ' !important;">' +
		'<span class="event-user-profile" data-original-title="" title="">' +
		'<a href="http://steamcommunity.com/profiles/' + user.steam_id + '" target="_blank">' +
		'<img src="' + user.steam_avatar + '" width="32">' +
		'<span class="mini-stat-icon" style="border-radius: 100%; background-color:' + colorArr[user.color] + '!important; height: 30px;width: 30px; "></span>' +
		'<span class="user-name">' + user.steam_name + user.id + '</span></a></span>' +
		'<span class="event-user-bet"> bet: <strong>' + user.total + '</strong> with a <strong>' + user.chance +'%</strong> to win!</span>' +
		'</div>' +
		'</div>'
	).appendTo('#currentround');
}

function addItemsToRound(items, color) {
    log(items);

    e = $("#pot");

	items.forEach( function(item) {

		totalValue += Number(item.value);
		var	stickers = "";
		var sticker_str = "";

		item.descriptions.forEach( function(desc) {
			if (desc.type=="html" && desc.value.indexOf("sticker_info")>-1)
			{
				stickers = $(desc.value).find("img");
			}
		});

		if (stickers!="")
		{
			$.each(stickers, function(index, sticker) {
				$(sticker).attr("width", 64);
				$(sticker).attr("height", 48);

				sticker_str += sticker.outerHTML;

				$(sticker).attr("width", 38);
				$(sticker).attr("height", 32);
				$(sticker).attr("class", "skin-sticker");
				$(sticker).attr("data-toggle", "tooltip");
				$(sticker).attr("data-placement", "bottom");
				$(sticker).attr("data-original-title", "Placed on " + item.market_name);
				allStickers += sticker.outerHTML;
			});
		}
		e.append(
			'<div class="animated jello thumbnail thumbnail-item pull-left" style="border-bottom: 4px solid ' + colorArr[color] + ';">' +
				'<img src="https://steamcommunity-a.akamaihd.net/economy/image/' + item.icon_url + '" alt="' + item.market_name + '">' +
				'<div class="caption">' +
				'<div class="item-name" style="font-size: 13px !important;">' + item.market_name + '</div>' +
				'<div class="item-price">' + item.value + '</div>' +
				'</div>' +
				'</div>'

		);
		tinysort('#pot>div', {selector: 'div.item-price', order:'desc'});
	});
}


server.on('winner msg', function(userid, tradeofferid) {
    if (idlist[userid] == undefined) {
        log('WINNER MSG [' + userid + '] ' + tradeofferid);
    } else {
        log('WINNER MSG [' + idlist[userid] + '] ' + tradeofferid);

    }
});


server.on('show winner', function(WinningNr, Winner) {
    log('WINNER [' + Winner.steam_name + ' // + ' + Winner.total + '] Waiting for trade link');
    idlist[Winner.id] = Winner.steam_name
});

$(document).ready(function() {
    init(); // Create block and set block variable
})
