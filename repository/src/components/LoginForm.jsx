/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
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
    navigate("/index")
  }
  const changeUsername = (event) => {
    setUsername(event.target.value);
  }
  const changePassword = (event) => {
    setPassword(event.target.value)
  }
  return (
    <div className='container bg-success mw-100 mh-100 p-3'>
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
      </div>
      <div className='text-center font-weight-light'>Recuperar Contraseña</div>
    </div>
    );
}

export default LoginForm;*/
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const token = await response.text(); // Si el backend devuelve un string directamente
        console.log("Token recibido:", token);
        
        // Almacenar el token JWT en el localStorage
        localStorage.setItem("token", token);
        
        // Navegar a la página de inicio o la página protegida
        navigate("/index");
      } else {
        // Manejo de errores de autenticación
        setError("Credenciales inválidas");
      }
    } catch (err) {
      console.error("Error durante el login:", err);
      setError("Ocurrió un error. Intenta nuevamente.");
    }
  };

  return (
    <div className='container bg-success mw-100 mh-100 p-3'>
      <div className="row ml-3 mr-3 border border-secondary rounded bg-dark">
        <div className="col blockquote text-center text-light font-weight-bold">LOGIN</div>
        <div className="w-100"/>
        <div className="col blockquote text-center text-light">Ingrese su email y contraseña</div>
        <div className="w-100"/>
        <form className="bg-dark-subtle col" onSubmit={(e) => { e.preventDefault(); onClick(); }}>
          <div>
            <label className="form-label text-light text-left">Email:</label>
            <input type="email" className="form-control" value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)}/><br/>
            <label className="form-label text-light text-left">Contraseña:</label>
            <input type="password" className="form-control" value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)}/><br/>
            {error && <div className="text-danger">{error}</div>}
            <div className="btn-group" role="group">
              <button type="submit" className="btn btn-lg btn-primary mb-3">Log In</button>
              <button type="button" className="btn btn-lg btn-primary mb-3 ml-1" onClick={() => navigate("/register")}>Sign Up</button>
            </div>
          </div>
        </form>
      </div>
      <div className='text-center font-weight-light'>Recuperar Contraseña</div>
    </div>
  );
}

export default LoginForm;
