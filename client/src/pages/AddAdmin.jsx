import Add from './UserDatabaseAdd.jsx'
import { useState } from "react";
import {login} from '../main'

function AddAdmin(){
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
      <h1>Add New Administrator</h1>
        <div>
            <input type="text" onChange={handleUsernameChange} value={username} placeholder = "Username" id="username"/><br/>
            <input type="text" onChange={handlePasswordChange} value={password} placeholder = "Password" id="password"/><br/>
            <button onClick={()=>Add(1,username,password)}>Create Account</button><br></br>
            <button onClick={()=>login()}>Return to Login</button>
        </div>
    </div>
  );
}

export default AddAdmin;