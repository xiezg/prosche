/**
 * Created by xiezg on 2020/3/9.
 */

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}

function postMsg(uri, send_msg, cb ){

    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', uri, true);
    httpRequest.send( JSON.stringify(send_msg));

    httpRequest.onreadystatechange = function () {
        if( httpRequest.readyState != 4 ){
            return;
        }

        if( cb != undefined && cb != null ){
            cb( httpRequest.status, JSON.parse(httpRequest.responseText) );
        }
    };
}

//p.appendChild( input )
//p.appendChild( actionType ) //0
//p.appendChild(actionTime)   //1
//p.appendChild(actionName)   //2
//p.appendChild(commitTime)   //3
//p.appendChild(takeTime)     //4
//p.appendChild(actionResult) //5
//p.appendChild(warning)  //6

var commit_data = function (obj) {
    obj = obj.target;
    var actionType = obj.nextSibling;
    var actionTime = actionType.nextSibling;
    var actionName = actionTime.nextSibling;
    var commitTime = actionName.nextSibling;
    //var actionResult = commitTime.nextSibling;

    postMsg( "api/commit_action", { ActionType:parseInt(actionType.innerText), CommitTime:commitTime.attributes["time"].value, Remarks:""}, function (status, resp) {
        if( status != 200 ){
            return
        }

        if( resp.Ret == 2 ){
            window.location.replace( "login.html" )
        }

        location.reload()
    } )
}

var showDayTime = function ( d ) {
    return d.getHours() + ":" + d.getMinutes()+ ":" + d.getSeconds();
}

var query_action = function ( timestamp_seconds ) {

    setshowDate(timestamp_seconds)

    postMsg('api/query_action',{time:parseInt( (timestamp_seconds).toFixed(0))}, function (status, resp) {
        if( status != 200 ){
            return
        }

        if( resp.Ret == 2 ){
            window.location.replace( "login.html" )
        }

        var node_list = document.getElementById( "list" );

        resp.Data.forEach(function (item) {

            var actionType = document.createElement( "span");
            var actionTime = document.createElement( "span" );
            var actionName = document.createElement( "span" );
            var commitTime = document.createElement( "span" );
            var takeTime = document.createElement( "span" );
            var actionResult = document.createElement( "span" );
            var warning = document.createElement("span")

            warning.setAttribute( "class", "warning" )
            //actionName.setAttribute( "class", "actionName" )

            actionType.innerText = item.Action_type;
            actionTime.innerText = item.Action_time;
            actionName.innerText = item.Action;
            takeTime.innerText = item.Take_time == null ? "" :item.Take_time;
            commitTime.innerText = item.Commit_time == null ? "": showDayTime( new Date( item.Commit_time.replace(/-/g, "/") ) );
            commitTime.setAttribute( "time",item.Commit_time == null ? "": item.Commit_time );
            actionResult.innerText = item.Remarks == null ? "":item.Remarks;
            warning.innerText = item.Warning == null?"":item.Warning;

            var input = document.createElement( "input" )
            input.type = "checkbox";
            input.onclick=commit_data;
            input.checked = item.Status != null

            //必须按照顺序添加，因为插在兄弟节点时时按照顺序的
            var p = document.createElement( "p" )
            p.appendChild( input )
            p.appendChild( actionType ) //0
            p.appendChild(actionTime)   //1
            p.appendChild(actionName)   //2
            p.appendChild(commitTime)   //3
            p.appendChild(takeTime)     //4
            p.appendChild(actionResult) //5
            p.appendChild(warning)  //6

            var div = document.createElement( "div" );
            div.setAttribute( "class", "task_item" )
            div.appendChild(p)
            node_list.appendChild(div)
        })
    } )
}

function show_days(){
    var start_time = new Date( 2020, 0,1).getTime()/1000;
    var end_time = new Date(2021,0,1 ).getTime()/1000;
    var cur_days = ((new Date().getTime()/1000 - start_time)/86400).toFixed(0);

    var days = (end_time-start_time)/86400;
    var days_list = document.getElementById( "days_list" )

    console.log( days )
    for( var i=0;i<days;i++ ){
        var item = document.createElement( "div" )
        item.setAttribute( "class", i<cur_days?"old_day":"new_day" )
        item.setAttribute( "index", i );

        if( i == cur_days ){
            item.setAttribute( "class", "today" )
        }

        item.onclick=function( obj){
            var index = obj.target.attributes["index"].value;
            var node_list = document.getElementById( "list" );
            node_list.innerText = "";

            query_action( start_time + index*86400  );
        }

        days_list.appendChild( item )
    }
}

var setshowDate= function ( timestamp_seconds ) {

    var d = new Date();

    if( timestamp_seconds ){
        d.setTime( timestamp_seconds*1000 )
    }

    document.getElementById("now_date").innerText = d.toLocaleDateString();// d.toLocaleDateString();//d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
}
window.onload= function () {

    query_action( (new Date().getTime())/1000 );
    show_days();
}
