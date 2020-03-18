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

var commit_data = function (obj) {

    console.log( obj )

    postMsg( "api/commit_action", { ActionType:parseInt(obj.target.value), CommitTime:"", Remarks:""}, function (status, resp) {
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

        for( var i = 0; i< resp.Data.length;i++ ){

            var input = document.createElement( "input" );
            input.type = "checkbox";
            input.onclick=commit_data;
            input.value = resp.Data[i].Id;

            var p = document.createElement("div");
            p.setAttribute( "class", "task_item" )
            p.appendChild(input);
            p.append( resp.Data[i].Action_time )
            p.append( "  " )
            p.append( resp.Data[i].Action );
            if( resp.Data[i].Commit_time != null ) {
                p.append("  ")
                p.append(resp.Data[i].Commit_time)
            }

            if( resp.Data[i].Status != null &&  resp.Data[i].Status == 1 ){
                input.checked = true;
            }
            node_list.appendChild(p);
        }
    } )
}

window.onload= function () {

    query_action();

    var d = new Date();
    document.getElementById("now_date").innerText = d.toLocaleDateString();//d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
}
