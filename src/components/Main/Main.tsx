import './Main.css'
import { Link } from 'react-router-dom';
import { Button, Container, CardHeader } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles"
import data from "../../util/words.json";

const themeLight = createTheme({
    palette: {
      background: {
        default: "#e4f0e2"
      }
    }
  });
  
  const themeDark = createTheme({
    palette: {
      background: {
        default: "#222222"
      },
      text: {
        primary: "#ffffff"
      }
    }
  });

/**
 * The main menu will feature a New Game button at the bare minimum.
 * @returns 
 */
function Main() {


    
    /**
     * Get random 5 letter word from https://github.com/RazorSh4rk/random-word-api
     * *random-words api doesn't allow min length words and has a rather
     * short list as well
     * var randomWords = require('random-words');*
     * *Consider using Wordnik in future*
     */
    let generateWord = () => {
      // let filteredList = data.filter(word => word.length == 5);
      // console.log(data);
      console.log("Your random word is...", data[Math.floor(Math.random() * data.length)]);
    }

    return (
        <ThemeProvider theme={themeDark}>
        <CssBaseline />
        <CardHeader title={"NotWordle"}>
            NotWordle
        </CardHeader>
        <Container id='main'>
            <Button variant="contained" component={Link} to="/game">
                New Game
            </Button>
            
            <Button variant="contained" onClick={generateWord}>
                Generate Word
            </Button>
        </Container>
        </ThemeProvider>
    );
};

export default Main;