// const url = chrome.runtime.getURL('diceware.wordlist.asc');

// fetch(url)
//     .then((response) => console.log(response)) //assuming file contains json
//     .then((json) => console.log(json));
let entireFile;


function readFile(){
    chrome.runtime.getPackageDirectoryEntry(function(root) {
        root.getFile('diceware.wordlist.asc', {}, function(fileEntry) {
            fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                entireFile = e.target.result.split('\n');
                let password = [];
                for (let i = 0; i < 7; i++) {
                    // gets random word for use
                    let word = entireFile[Math.floor(Math.random()* 7467)].split('\t')[1];
                    password.push(word);
                }
                password = password.join('');
                console.log(password);
                document.getElementById('newPassword').innerHTML = password;
            };
            reader.readAsText(file);
            });
        });
    });
}

readFile();