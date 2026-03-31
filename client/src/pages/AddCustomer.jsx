/*import Add from './UserDatabaseAdd'*/
import { useState } from "react";
/*import {login} from '../main'*/
import {useNavigate} from 'react-router-dom';

function AddCustomer(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    function handleUsernameChange(e)
    {
        setUsername(e.target.value);
    }

    function handlePasswordChange(e)
    {
        setPassword(e.target.value);
    }
    
    function returnToLogin(){
        navigate("/");
    }
    
    async function Add(){
        let doc ={
            "username": username,
            "password": password,
            "role": "user",
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

    

    return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Add New Customer</h1>
        <div>
            <input type="text" onChange={handleUsernameChange} value={username} placeholder = "Username" id="username"/><br/>
            <input type="text" onChange={handlePasswordChange} value={password} placeholder = "Password" id="password"/><br/>
            <button onClick={()=>Add()}>Create Account</button><br></br>
            <button onClick={returnToLogin}>Return to Login</button>
        </div>
    </div>
  );
}



export default AddCustomer;