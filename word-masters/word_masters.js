const letters = document.querySelectorAll(".letter-box")
const brand = document.querySelector(".brand")
const loadingSection = document.querySelector(".loading-section")
let isLoading = true
let done = false

async function onGame() {
    const wordURL = "https://words.dev-apis.com/word-of-the-day"
    const response = await fetch(wordURL)
    const wordObject = await response.json()
    const word = wordObject.word.toUpperCase()
    isLoading = false
    setLoading(isLoading)

    let count = 0
    let minCount = 0
    let maxCount = 4
    let guessWord = ""
    let guesses = 0

    addEventListener("keydown", async (event) => {
        const letter = event.key

        if (done || isLoading) {
            return
        }

        if (isLetter(letter)){
            if (minCount <= count && count <= maxCount){
                letters[count].innerText = letter.toUpperCase()
                count++
                guessWord += letter.toUpperCase()
                console.log(guessWord)
            }
            if (count - 1 === maxCount) {
                isValid = await isValidWord(guessWord)
                if(guessWord === word) {
                    await setWinner(minCount, maxCount)
                    brand.classList.add("winner")
                    sleep(5000).then(() => {alert("You win!")})
                    done = true
                } else if (isValid) {
                    const positions = checkLetterPosition(word, guessWord)
                    setBoxColors(positions, minCount, maxCount)
                    if (guesses === 5) {
                        sleep(10).then(() => {alert(`You lost! The word was ${word}`)})
                        done = true
                    }
                    guesses++
                    minCount += 5
                    maxCount += 5
                    guessWord = ""
                } else {
                    setInvalid(minCount, maxCount)
                }
            }
            
        } else if(letter === "Backspace" && count > minCount) {
            letters[count - 1].innerText = ""
            count--
            guessWord = guessWord.slice(0, guessWord.length - 1)
            console.log(minCount, maxCount)
            setInvalid(minCount, maxCount)
        }
    })
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function isValidWord(word) {
    isLoading = true
    setLoading(isLoading)
    const wordsURL = "https://words.dev-apis.com/validate-word"
    const response = await fetch(wordsURL, {
        method: "POST",
        body: JSON.stringify({"word": word})
    })

    const { validWord } = await response.json()
    isLoading = false
    setLoading(isLoading)

    if(validWord) {
        return true
    }
    return false
}

function checkLetterPosition(word, guess) {
    const positions = ["normal", "normal", "normal", "normal", "normal"]
    const letterDictionary = getLetterDictionary(word)

    for (let i = 0; i < guess.length; i++) {
        if (word.includes(guess[i])){
            if (guess[i] === word[i]){
                positions[i] = "correct"
                letterDictionary[word[i]] -= 1
            }
        }
    }

    for (let i = 0; i < guess.length; i++) {
        if (word.includes(guess[i])){
            if (guess[i] === word[i]){
                break
            } else {
                if (positions[i] != "correct"){
                    positions[i] = "close"
                }
            }
        } else {
            positions[i] = "wrong"
        }    
    }
    return positions
}

function setBoxColors(positions, min, max) {
    for (let i = min; i <= max; i++) {
        letters[i].classList.add(positions[i % 5]);
    }
}

function getLetterDictionary(word) {
    const letterDictionary = {}
    for (let i = 0; i < word.length; i++) {
        if (word[i] in letterDictionary) {
            letterDictionary[word[i]] += 1
        } else {
            letterDictionary[word[i]] = 1
        }
    }
    return letterDictionary
}

function setInvalid(min, max) {
    for (let i = min; i <= max; i++) {
        console.log(min, max)
        letters[i].classList.toggle("invalid")
    }
}

function setWinner(min, max) {
    for (let i = min; i <= max; i++) {
        letters[i].classList.add("winner")
    }
}

function setLoading(isLoading) {
    loadingSection.classList.toggle("hidden", !isLoading)
}
onGame()