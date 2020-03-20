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

    postMsg( "api/commit_action", { ActionType:parseInt(actionType.innerText), CommitTime:commitTime.innerText, Remarks:""}, function (status, resp) {
        if( status != 200 ){
            return
        }

        if( resp.Ret == 2 ){
            window.location.replace( "login.html" )
        }
    } )
}

var query_action = function () {
    postMsg('api/query_action',null, function (status, resp) {
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

            actionType.innerText = item.Action_type;
            actionTime.innerText = item.Action_time;
            actionName.innerText = item.Action;
            takeTime.innerText = item.Take_time == null ? "" :item.Take_time;
            commitTime.innerText = item.Commit_time == null ? "未打卡":item.Commit_time;
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

window.onload= function () {

    query_action();

    var d = new Date();
    document.getElementById("now_date").innerText = d.toLocaleDateString();//d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
}
