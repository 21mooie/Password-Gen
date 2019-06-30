// const url = chrome.runtime.getURL('diceware.wordlist.asc');

// fetch(url)
//     .then((response) => console.log(response)) //assuming file contains json
//     .then((json) => console.log(json));
let passwords;


function readFile(){
    chrome.runtime.getPackageDirectoryEntry(function(root) {
        root.getFile('diceware.wordlist.asc', {}, function(fileEntry) {
            fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                // contents are in this.result
                passwords = e.target.result.split('\n');
                // console.log(passwords);
                let wordList = [];
                for (let i = 0; i < 7; i++) {
                    console.log('here');
                    console.log(passwords[Math.floor(Math.random()* 7467)].split(' '));
                    wordList.push();
                }
                console.log(wordList);
            };
            reader.readAsText(file);
            });
        });
    });
}

readFile();
readFile();
readFile();