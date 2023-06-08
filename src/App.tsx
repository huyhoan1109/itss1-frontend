import { useState } from 'react';
import BrowserRouter from './routes/BrowserRouter'
import ScrollButton from './components/ScrollButton';

const App = () => {
    const [auth, setAuth] = useState(
        false || window.localStorage.getItem("access_token") === "true"
    );
    
    return (
        <div>
            <BrowserRouter />
            <ScrollButton />
        </div>
    )
}

export default App