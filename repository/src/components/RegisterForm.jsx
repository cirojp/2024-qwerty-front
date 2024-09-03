import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onRegister = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        // Redirige al usuario a la página de inicio de sesión después del registro
        navigate("/login");
      } else {
        setError("Error al registrar el usuario");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Ocurrió un error. Intenta nuevamente.");
    }
  };

  return (
    <div className='container bg-success mw-100 mh-100 p-3'>
      <div className="row ml-3 mr-3 border border-secondary rounded bg-dark">
        <div className="col blockquote text-center text-light font-weight-bold">REGISTER</div>
        <div className="w-100"/>
        <div className="col blockquote text-center text-light">Crea una nueva cuenta</div>
        <div className="w-100"/>
        <form className="bg-dark-subtle col" onSubmit={(e) => { e.preventDefault(); onRegister(); }}>
          <div>
            <label className="form-label text-light text-left">Email:</label>
            <input type="email" className="form-control" value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)}/><br/>
            <label className="form-label text-light text-left">Contraseña:</label>
            <input type="password" className="form-control" value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)}/><br/>
            {error && <div className="text-danger">{error}</div>}
            <div className="btn-group" role="group">
              <button type="submit" className="btn btn-lg btn-primary mb-3">Register</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
