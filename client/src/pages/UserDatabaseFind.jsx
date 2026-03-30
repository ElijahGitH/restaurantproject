import { useNavigate } from 'react-router-dom';
/*import {CustomerDash, AdminDash} from '../main'*/

function loginCheck(username, password) {
    if (username === "user" && password === "user123") {
        return 0; // user
    }

    if (username === "admin" && password === "admin123") {
        return 1; // admin
    }

    return -1; // invalid login
}

    /*response = await fetch('http://localhost:5000/admin');
    data = await response.json();
    isAdmin = data.some(item=>item.username === username);

    if(isAdmin === true){
        foundUser = data.find((user)=>user.username === username);
        if (foundUser.password === password){
            return(1);
        }
    }

    response = await fetch('http://localhost:5000/customer');
    data = await response.json();
    isUser = data.some(item=>item.username === username);

    if(isUser === true){
        foundUser = data.find((user)=>user.username === username);
        if (foundUser.password === password){
            return(0);
        }
    }*/
}
export default loginCheck;

