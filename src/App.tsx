import { useState } from 'react';
import BrowserRouter from './routes/BrowserRouter'

const App = () => {
  const [auth, setAuth] = useState(
    false || window.localStorage.getItem("access_token") === "true"
  );
  
  return (
    <BrowserRouter />
  )
}

export default App