import Add from './UserDatabaseAdd'
import { useState } from "react";

function AddCustomer(){
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
      <h1>Add New Customer</h1>
        <div>
            <input type="text" onChange={handleUsernameChange} value={username} placeholder = "Username" id="username"/><br/>
            <input type="text" onChange={handlePasswordChange} value={password} placeholder = "Password" id="password"/><br/>
            <button onClick={()=>Add(0,username,password)}>Create Account</button>
        </div>
    </div>
  );
}



export default AddCustomer;