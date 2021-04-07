const axios = require('axios');
var fetchUrl = require("fetch").fetchUrl;

const APIkey = "dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf";


let string, frequencies = {}
const getFileFromServer = async () => {
    fetchUrl('http://norvig.com/big.txt', function (error, meta, body) {
        string = body.toString()

        /****Removing special characters from string and replacing it with empty spaces*****/
        var cleanString = string.toString().replace(/[.,-/#!$%^&*;:{}=\-_`~()]/g, "");

        /*****************Creating array of each based on spaces****************************/
        words = cleanString.split(' '),
            frequencies = {};
        var word, i;

        /******************to filter all empty elements from the array ***********************/
        words = words.filter(entry => /\S/.test(entry));
        for (i = 0; i < words.length; i++) {
            word = words[i];
            if (word.length > 5) {
                frequencies[word] = frequencies[word] || 0;
                frequencies[word]++;
            }
        }
        words = Object.keys(frequencies);
        var topWordArray = words.sort(function (a, b) {
            return frequencies[b] - frequencies[a];
        }).slice(0, 10);
        topWordArray.forEach(eachWord => {

            /**************Function call to get meaning for each word *********************/
            getFilteredMeaning(eachWord).then(data => {
                console.table(data)
            })
        })
    });
}


const getFilteredMeaning = async (word) => {
    const wordDetails = await axios.get(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${APIkey}&lang=en-ru&text=${word}`)
    return {
        Word: wordDetails.data.def[0].text ? wordDetails.data.def[0].text : "No Text found",
        Pos: wordDetails.data.def[0].pos ? wordDetails.data.def[0].pos : "No Part of speech found",
        Count: frequencies[word] ? frequencies[word] : "N/A",
        Synonyms: wordDetails.data.def[0].mean ? wordDetails.data.def[0].mean : "No Synonyms found"
    }

}
console.table("Please wait while we fetch data")

/**********************Invoking Function******************************************/
getFileFromServer()