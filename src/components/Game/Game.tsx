
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Box, Grid, Paper, Modal, TextField, Typography, CssBaseline, styled } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles"
import {makeStyles} from "@mui/styles";
import POSSIBLE_WORDS from "../../src/util/words.json";
import VALID_WORDS from "../../src/util/valid-words.json";
import KEYBOARD from "../../src/util/alphabet.json";

/**
 * This component represents a standard game of Wordle, ie 6 rows of 5 boxes in
 * which players can guess words.
 * 
 */

/**
 * CSS Stylings
 */
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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const StyledTextField = styled(TextField)({
    backgroundColor: "#eee",
    color: "#000000",
    "&.Mui-focused": {
    }
})

const GridButton = styled(Button)({
    backgroundColor: "white",
    fontSize: "min(50%, 18px)",
    color: "black",
    "&:hover": {
        color: "white"
    }
    
})

const useStyles = makeStyles({
    correctLetter: {
        backgroundColor: "#80d100"
    },
    almostLetter: {
        backgroundColor: "#ebcb00"
    },
    wrongLetter: {
        backgroundColor: "red"
    },
    usedLetter: {
        backgroundColor: "gray"
    },
    normalLetter: {
        backgroundColor: "white"
    }
});

/**
 * This component represents a row in the wordle grid.
 * It contains 5 boxes of letters. The letters are passed
 * through state props whenever the currently active
 * word is modified.
 * 
 * TODO: Modify WordRow to resemble Alphabet structure
 * 
 * @returns WordRow functional component
 */
function WordRow(props: any) {
    const classes = useStyles();

    return (
        <>
        {/* {console.log(props.word)} */}
        <Grid container item columnSpacing={1} direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={0.5}>
                {/* @ts-ignore */}
                <Item className={classes[`${props.colors[0]}`]} >{props.word.charAt(0)}</Item>
            </Grid>
            <Grid item xs={0.5}>
                {/* @ts-ignore */}
                <Item className={classes[`${props.colors[1]}`]} >{props.word.charAt(1)}</Item>
            </Grid>
            <Grid item xs={0.5}>
                {/* @ts-ignore */}
                <Item className={classes[`${props.colors[2]}`]} >{props.word.charAt(2)}</Item>
            </Grid>
            <Grid item xs={0.5}>
                {/* @ts-ignore */}
                <Item className={classes[`${props.colors[3]}`]} >{props.word.charAt(3)}</Item>
            </Grid>
            <Grid item xs={0.5}>
                {/* @ts-ignore */}
                <Item className={classes[`${props.colors[4]}`]} >{props.word.charAt(4)}</Item>
            </Grid>
        </Grid>
        </>
    )
}

/**
 * Component to display a QWERTY layout keyboard which highlights
 * used letters in their corresponding colors.
 * @param props 
 * @returns 
 */
function Alphabet(props: any) {
    const classes = useStyles();

    return (
        <Grid container item rowSpacing={2} columnSpacing={8} width={"60%"} direction="row" justifyContent="center" alignItems="center">
            {KEYBOARD.slice(0,10).map(item => (
            <Grid item xs={1.2}>
                {/* @ts-ignore */}
                <GridButton className={classes[`${item.color}`]} onClick={props.onChange}>{item.letter}</GridButton>
            </Grid>
            ))}
            {KEYBOARD.slice(10,19).map(item => (
            <Grid item xs={1.3}>
                {/* @ts-ignore */}
                <GridButton className={classes[`${item.color}`]} onClick={props.onChange}>{item.letter}</GridButton>
            </Grid>
            ))}
            {KEYBOARD.slice(19,29).map(item => (
            <Grid item xs={1.2}>
                {/* @ts-ignore */}
                <GridButton className={classes[`${item.color}`]} onClick={props.onChange}>{item.letter}</GridButton>
            </Grid>
            ))}
        </Grid>
    )
}

/**
 * Users play the game by inputting 5 letter words in an 
 * attempt to determine the secret word. 
 * 
 * TODO: Instructions modal
 * 
 * The game ends when the user either correctly guesses the
 * word, or they fail to determine the word in 6 guesses.
 * 
 * TODO: End Game modal
 * 
 */
function Game() {

    const classes = useStyles();

    // Store of guesses in current game
    const [wordList, setWordList] = useState(['','','','','','']);
    // Store of colors for each letter
    const [colorList, setColorList] = useState(Array.from(Array(6), () => Array(5).fill("normalLetter")))
    // Index of current word in game
    const [currentWord, setCurrentWord] = useState(0);
    // Input field
    const [textValue, setTextValue] = useState('');
    // Correct word, initialized on game start
    const [correctWord, setCorrectWord] = useState('');

    // States and handlers for modal
    const [open, setOpen] = useState(false);
    const [titleText, setTitleText] = useState('');
    const [descText, setDescText] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        window.location.href = "/";
    }

    // Initialize random word and handle page refresh
    useEffect(() => {
        setCorrectWord(POSSIBLE_WORDS[Math.floor(Math.random() * POSSIBLE_WORDS.length)]);

        return () => {
            window.location.href = "/";            
        }
    }, [])

    // Handle Keydown listener interactions with textValue
    // and wordList states
    useEffect(() => {
        // console.log("Updated Text Value is: ", textValue)
        document.addEventListener('keydown', onTypeChange);

        return () => {
            document.removeEventListener('keydown', onTypeChange);
        }
    }, [textValue, wordList])

    // Logging functions to periodically check state
    useEffect(() => {
        // console.log("Updated Word List: ", wordList);
    }, [wordList])

    useEffect(() => {
        // console.log("The correct word is: ", correctWord);
        // console.log("colorList: ", colorList)
    }, [correctWord])

    useEffect(() => {
        // console.log("Updated color list: ", colorList);
    }, [colorList])


    /**
     * Handler function for using the on-screen keyboard.
     * 
     * @param e 
     */
    let onKeyboardChange = (e: any) => {
        // Either append letter if space allows,
        // Remove letter if Delete was pressed,
        // Or submit word if Enter was pressed.
        let selection = e.target.innerText;

        if (selection === "DEL") {
            if (textValue.length > 0) {
                updateWord(textValue.slice(0, -1));
            }
        }
        else if (selection === "ENTER") {
            submitWord();
        }
        else {
            if (textValue.length <= 4) {
                console.log(textValue, selection)
                updateWord(textValue + selection);
            }
        }
    }

    /**
     * Handler function for typing text anywhere on the page.
     * 
     * @param e 
     */
    let onTypeChange = (e: any) => {
        // console.log("in typing", e.key, "textValue=", textValue, "word=", wordList[currentWord])
        let word;
        if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
            if (textValue.length <= 4) {
                word = textValue + e.key.toUpperCase();
                // console.log("textValue=", textValue, "word=", word)
                updateWord(word);
            }
        } else if(e.key === "Backspace") {
            if (textValue.length > 0) {
                word = textValue.slice(0, -1);
                updateWord(word);
            }
        } else if (e.key === 'Enter') submitWord();
    }

    /**
     * Handler function to connect all methods of guessing
     * letters (Typing in box, Typing elsewhere, Clicking
     * keyboard buttons) into same logic.
     * 
     * Highlights letters in red if current 5 letter word
     * is not in the dictionary.
     * 
     * @param e 
     */
     let updateWord = (word: string) => {
        // Check if 5 letter word is in the dictionary
        let tempColors = colorList;
        if (word.length === 5 && !VALID_WORDS.includes(word.toLowerCase())) {
            tempColors[currentWord].fill("wrongLetter");
        } else tempColors[currentWord].fill("normalLetter");
        setColorList(tempColors);

        // Update displayed letters
        // console.log("new word=", word)
        setTextValue(word);
        setWordList(currentList => [
            ...currentList.slice(0, currentWord),
            word,
            ...currentList.slice(currentWord + 1)
        ])
    }

    /**
     * Handler function for whenever a word is submitted/user presses enter.
     * - Does not submit word if it is not in the dictionary.
     * - If the user answers correctly, end game
     * - If this is the last attempt, end game
     * - Updates submitted word to its corresponding colors.
     * 
     */
    let submitWord = () => {
        // console.log(wordList[currentWord], wordList[currentWord].toLowerCase())
        if (!VALID_WORDS.includes(wordList[currentWord].toLowerCase())) {
            console.log("That word is not in the dictionary!")
        } else {
            handleColorLogic();
            if (wordList[currentWord].toLowerCase() === correctWord) {
                // console.log("You correctly guessed the word! (", correctWord, ")");
                setTitleText("You correctly guessed the word! (" + correctWord + ")");
                var numGuesses = currentWord + 1;
                setDescText("It took you " + numGuesses + " guesses.");
                handleOpen();
                setTextValue('');
            } else if (currentWord >= 5) {
                // console.log("Sorry, you have failed the game...");
                setTitleText("Sorry, you have failed the game...");
                setDescText("The word was: " + correctWord);
                handleOpen();
                setTextValue('');
            } else {
                setCurrentWord(currentWord + 1);
                setTextValue('');
            }
        }
    }

    /**
     * Compares the last submitted word to the correct word and assigns
     * colors accordingly.
     * - Green : Correct letter, correct spot
     * - Yellow : Correct letter, wrong spot
     * - White : Letter is not in the word
     * - Red : The word is invalid
     */
    let handleColorLogic = () => {
        // Compare inputWord to correctWord
        let inputWord = wordList[currentWord].toLowerCase();
        let tempColors = colorList;
        let remainingLetters : string[] = [...correctWord];

        // Check for greens
        for ( var i=0; i < 5; i++ ) {
            if (inputWord.charAt(i) === correctWord.charAt(i)) {
                tempColors[currentWord][i] = "correctLetter";
                // Update keyboard colors as well
                let keyboardIndex = KEYBOARD.findIndex((element) => element.letter === inputWord.charAt(i).toUpperCase());
                if (KEYBOARD[keyboardIndex].color !== "correctLetter")
                    KEYBOARD[keyboardIndex].color = "correctLetter";
                remainingLetters[i] = "0";
            }
        }

        // Check for yellows
        // i : letter in submitted word
        // j : corresponding index in correct word
        for ( var i=0; i < 5; i++ ) {
            if (tempColors[currentWord][i] === "normalLetter") {
                var j = remainingLetters.findIndex(letter => letter === wordList[currentWord]
                                                        .toLowerCase()[i]);
                // console.log("findIndex: ", j);
                if (j != -1) {
                    tempColors[currentWord][i] = "almostLetter";
                    // Update keyboard colors as well
                    let keyboardIndex = KEYBOARD.findIndex((element) => element.letter === inputWord.charAt(i).toUpperCase());
                    if (KEYBOARD[keyboardIndex].color === "normalLetter")
                        KEYBOARD[keyboardIndex].color = "almostLetter";
                    remainingLetters[j] = "0";
                }
            }
        }

        // Check for remainding letters
        // i : letter in submitted word
        for ( var i=0; i < 5; i++ ) {
            if (tempColors[currentWord][i] === "normalLetter") {
                // Update keyboard colors
                let keyboardIndex = KEYBOARD.findIndex((element) => element.letter === inputWord.charAt(i).toUpperCase());
                if (KEYBOARD[keyboardIndex].color === "normalLetter")
                    KEYBOARD[keyboardIndex].color = "usedLetter";
            }
        } 

        setColorList(tempColors);
    }

    return (
        <ThemeProvider theme={themeDark}>
        <CssBaseline />
        
        <Box pt={5}>
            {/* Word List */}
            <Grid container spacing={3}>
                <WordRow word={wordList[0]} colors={colorList[0]} />
                <WordRow word={wordList[1]} colors={colorList[1]}/>
                <WordRow word={wordList[2]} colors={colorList[2]}/>
                <WordRow word={wordList[3]} colors={colorList[3]}/>
                <WordRow word={wordList[4]} colors={colorList[4]}/>
                <WordRow word={wordList[5]} colors={colorList[5]}/>
            </Grid>

            {/* Word Input Field */}
            {/* <Grid container pt={5} justifyContent="center">
                <StyledTextField
                sx={{ input: { color: 'black' } }}
                inputProps={{
                    maxLength: 5
                }}
                id='word'
                label='Enter a word'
                name='word'
                value={textValue}
                variant='outlined'
                />
            </Grid> */}

            {/* Keyboard/Alphabet */}
            <Grid container rowSpacing={3} justifyContent="center" pt={5}>
                <Alphabet onChange={onKeyboardChange}/>
            </Grid>

            {/* Dynamic Modal */}
            <Grid container pt={5} justifyContent="center">
                {/* <Button onClick={handleOpen}>Open modal</Button> */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                    <Box 
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            color: "black"
                        }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {titleText}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {descText}
                        </Typography>
                    </Box> 
                </Modal>
            </Grid>
            
            <Button variant="contained" component={Link} to="/">
                Back
            </Button>
        </Box>
        
        </ThemeProvider>
    );
};

export default Game;