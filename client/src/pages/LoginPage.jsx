import { useState } from "react";
import { Link } from "react-router-dom";
/*import loginCheck from './UserDatabaseFind';*/
/*import {AddCust, AddAdministrator} from '../main'*/

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
    function handleUsernameChange(e)
    {
        setUsername(e.target.value);
    }

    function handlePasswordChange(e)
    {
        setPassword(e.target.value);
    }

    return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Restaurant Login</h1>
        <div>
            <input type="text" onChange={handleUsernameChange} value={username} placeholder = "Username" id="username"/><br/>
            <input type="text" onChange={handlePasswordChange} value={password} placeholder = "Password" id="password"/><br/>
            <button /*onClick={()=>loginCheck(username,password)}*/>Login</button><br></br>
            <Link to="/userregister">Customer Registration</Link><br></br>
            <Link to="/adminregister">Administrator Registration</Link>
            {/*<button onClick={()=>AddCust()}>Add Customer</button>
            <button onClick={()=>AddAdministrator()}>Add Administrator</button>*/}
        </div>
    </div>
  );
}

export default LoginPage;