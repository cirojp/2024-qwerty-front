import './App.css'
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<LoginForm/>} />
        <Route exact path='/index' element={<HomePage/>} />
      </Routes>
    </Router>
  )
}

export default App;
