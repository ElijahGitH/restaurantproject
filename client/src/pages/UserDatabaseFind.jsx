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

export default loginCheck;

