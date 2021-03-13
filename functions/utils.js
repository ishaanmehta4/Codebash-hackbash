const axios = require('axios').default;

async function parseRatingQuery(msgText) {
    wordsArray = msgText.split(' ').filter(w => (w !== '' || w !== '.' || w !== ' ' || w !== ',' || w !== '?'));
    wordsArray = wordsArray.map(word => {
        let lastChar = word[word.length - 1]
        let symbols = [',', ' ', '.', ':', '?']
        if(symbols.lastIndexOf(lastChar) == -1) return removeApostrophe(word)
        else return word.slice(0, word.length - 1)
    })

    // let result = await getResult(wordsArray)
    wordsArray = [wordsArray[0], wordsArray[1]]
    let result = {}
    if(wordsArray[0] == 'hackerearth' || wordsArray[0] == 'codechef' || wordsArray[0] == 'codeforces') {
        result.platform = wordsArray[0]
        result.username = wordsArray[1]
    }
    else if(wordsArray[1] == 'hackerearth' || wordsArray[1] == 'codechef' || wordsArray[1] == 'codeforces') {
        result.platform = wordsArray[1]
        result.username = wordsArray[0]
    }
    if(result.username && result.platform) return {...result, rating: 0, error: 0}
    else return {error: 'Invalid username or platform. :('}
}

function removeApostrophe(word) {
    let charsArray = word.split('')
    if(charsArray.lastIndexOf("'") == -1) return word
    else return word.slice(0, word.length - 2)
}

async function getResult(wordsArray) {
    let result = { username: '', platform: '', rating: 0, error: 0 }
    meaningwords = []
    wordsArray.forEach(async (word) => {

        try {
            // console.log('https://api.dictionaryapi.dev/api/v2/entries/en_US/' + word)
            let meaningRes = await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en_US/' + word)
            // meaningRes =await meaningRes
            console.log(meaningRes.data[0].word + '$')
            meaningwords.push(word)
            // if(meaningRes.data[0].word.length == 0 || meaningRes.data[0].word.length == undefined) {
            //     if(word == 'hackerearth' || word == 'codechef' || word == 'codeforces') result.platform = word
            //     else result.username = word

            //     console.log(word + ' no meaning')
            // }
        } catch(err) { console.log('err') }

    })

console.log(meaningwords)
}

module.exports = { parseRatingQuery }