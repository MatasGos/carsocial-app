import React from 'react'
import {
    Redirect
  } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {API} from './const'

export let loginContext = {user: "", id: -1, role: "guest", date: null};
export function UserRole()
{
    if (window.localStorage.getItem("token") && window.localStorage.getItem("exp")<new Date().getTime() / 1000 )
    {
        loginContext = {id: window.localStorage.getItem("id"), role: window.localStorage.getItem("role")};
        if (loginContext.role === "admin")
        {
            return 2;
        }
        else
        {
            return 1;
        }
    }
    else
    {
        return 0;
    }
}

