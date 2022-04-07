
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Main from './components/Main/Main';
import Game from "./components/Game/Game";
import './App.css';

function App() {
  return (
    <Router>
      <Container maxWidth="xl">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/game" element={<Game />} />
        </Routes>
        {/* <Main></Main> */}
      </Container>
    </Router>
  );
}

export default App;
