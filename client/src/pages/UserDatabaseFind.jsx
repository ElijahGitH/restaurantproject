import { useState, useEffect } from 'react'
import {CustomerDash, AdminDash} from '../main'
import LoginPage from './LoginPage';

async function loginCheck(username,password){
    let response,data,isAdmin,isUser,foundUser;
    
    response = await fetch('http://localhost:5000/admin');
    data = await response.json();
    isAdmin = data.some(item=>item.username === username);

    if(isAdmin === true){
        foundUser = data.find((user)=>user.username === username);
        if (foundUser.password === password){
            return(AdminDash(username));
        }
    }

    response = await fetch('http://localhost:5000/customer');
    data = await response.json();
    isUser = data.some(item=>item.username === username);

    if(isUser === true){
        foundUser = data.find((user)=>user.username === username);
        if (foundUser.password === password){
            return(CustomerDash(username));
        }
    }
}

export default loginCheck;