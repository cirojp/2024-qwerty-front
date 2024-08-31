import React, { useState } from "react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const onClick = ()=>{
    const userData = {
      username: username,
      password: password
    }
    console.log(userData);
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
    <div className="row ml-3 mr-3 border border-secondary rounded bg-dark">
    <div className="col blockquote text-center text-light font-weight-bold">LOGIN</div>
    <div className="w-100"/>
    <div className="col blockquote text-center text-light">Ingrese su usuario y contraseña</div>
    <div className="w-100"/>
    <form className="bg-dark-subtle col">
      <div>
        <label className="form-label text-light text-left">Usuario:</label>
        <input type="text" className="form-control" value={username} placeholder='Username' onChange={(newEvent) => {changeUsername(newEvent)}}/><br/>
        <label className="form-label text-light text-left">Contraseña:</label>
        <input type="password" className="form-control" value={password} placeholder='Password' onChange={(newEvent) => {changePassword(newEvent)}}/><br/>
        <div className="btn-group" role="group">
          <input type="button" className="btn btn-lg btn-primary mb-3" value="Log In" onClick={onClick}/>
          <input type="button" className="btn btn-lg btn-primary mb-3 ml-1" value="Sign Up" onClick={()=> {console.log("A Registrarse!")}}/>
        </div>
      </div>
    </form>
  </div>);
}

export default LoginForm;
