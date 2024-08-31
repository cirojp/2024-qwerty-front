import React, { useState } from "react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const onClick = ()=>{
    console.log(username);
    console.log(password);
    setUsername("");
    setPassword("");
  }
  const changeUsername = (event) => {
    setUsername(event.target.value);
  }
  const changePassword = (event) => {
    setPassword(event.target.value)
  }
  return (
    <div style={{ backgroundColor: 'lightgrey', flex: 1}}>
    <div>LOGIN</div>
    <div>Ingrese su usuario y contraseña</div>
    <div>
      <label>Usuario:</label>
      <input type="text" value={username} placeholder='Username' onChange={(newEvent) => {changeUsername(newEvent)}}/><br/>
      <label>Contraseña:</label>
      <input type="text" value={password} placeholder='Password' onChange={(newEvent) => {changePassword(newEvent)}}/><br/>
      <input type="button" value="Log-In" onClick={onClick}/>
    </div>
  </div>);
}

export default LoginForm;
