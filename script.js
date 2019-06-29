// const url = chrome.runtime.getURL('diceware.wordlist.asc');

// fetch(url)
//     .then((response) => console.log(response)) //assuming file contains json
//     .then((json) => console.log(json));


chrome.runtime.getPackageDirectoryEntry(function(root) {
    root.getFile('diceware.wordlist.asc', {}, function(fileEntry) {
        fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            // contents are in this.result
            console.log(e.target.result);
        };
        console.log(reader.readAsText(file));
        });
    });
    });
    