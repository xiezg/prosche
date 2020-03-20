/*************************************************************************
# File Name: main.go
# Author: xiezg
# Mail: xzghyd2008@hotmail.com
# Created Time: 2020-03-08 10:45:57
# Last modified: 2020-03-15 16:20:53
************************************************************************/

package main

import "fmt"
import "time"
import "daka/db"
import "net/http"
import "encoding/json"
import "github.com/gorilla/mux"
import "github.com/xiezg/muggle/auth"

func commit_action(b []byte) (interface{}, error) {

	msg := struct {
		ActionType int    `json:"ActionType"`
		CommitTime string `json:"CommitTime"`
		Remarks    string `json:"Remarks"`
	}{}

	if err := json.Unmarshal(b, &msg); err != nil {
		return nil, err
	}

	fmt.Println(msg)
	err := db.TaskCommit(msg.ActionType, msg.CommitTime, msg.Remarks)

	return nil, err
}

func query_action_list(b []byte) (interface{}, error) {

	return db.QueryActionList(time.Now())
}

func main() {

	r := mux.NewRouter()

	r.HandleFunc("/daka/api/query_action", auth.Auth(query_action_list))
	r.HandleFunc("/daka/api/login", auth.Login(db.QueryAccountInfo, "/daka/index.html"))
	r.HandleFunc("/daka/api/commit_action", auth.Auth(commit_action))

	http.ListenAndServe("127.0.0.1:8081", r)
}
