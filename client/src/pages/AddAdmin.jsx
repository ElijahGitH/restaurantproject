/*import Add from './UserDatabaseAdd.jsx'*/
import { useState } from "react";
/*import {login} from '../main'*/
import {useNavigate} from 'react-router-dom';

function AddAdmin(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function Add(){
        let doc ={
            "username": username,
            "password": password,
            "role": "admin",
        }

        try{
            let response = await fetch("http://localhost:5000/users",
            {
                method: "POST",
                body: JSON.stringify(doc),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if(response.ok === false){
                window.alert("This username is already taken");
            } 
    }
        catch(error){
            console.log("Error");
        }
    }

    function returnToLogin(){
        navigate("/");
    }
  
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
            <button onClick={()=>Add()}>Create Account</button><br></br>
            <button onClick={returnToLogin}>Return to Login</button>
        </div>
    </div>
  );
}

export default AddAdmin;