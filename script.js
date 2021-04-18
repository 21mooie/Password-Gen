let entireFile;


function readFile(allowCaps, allowNumbers, allowSpecialChars){
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
                    if (allowCaps) {
                        word = word.charAt(0).toUpperCase() + word.slice(1);
                    }
                    if (allowNumbers) {
                        word = word.split('').map((letter) => {
                            switch(letter) {
                                case 'e':
                                    return '3';
                                case 'o':
                                    return '0';
                                default:
                                    return letter;
                            }
                        }).join('');
                    }
                    if (allowSpecialChars) {
                        word = word.split('').map((letter) => {
                            switch(letter) {
                                case 'a':
                                    return '@';
                                case 'i':
                                    return '!';
                                default:
                                    return letter;
                            }
                        }).join('');
                    }
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

document.getElementById('generatePasswordButton').addEventListener('click', () => {
    readFile(document.getElementById('caps').checked, document.getElementById('numbers').checked, document.getElementById('specialChars').checked);
});

document.getElementById('copy').addEventListener('click', () => {
    const copyText = document.getElementById('newPassword');
    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");

    alert("Copied the text: " + copyText.value);
})