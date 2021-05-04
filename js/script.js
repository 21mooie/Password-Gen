var slider = document.getElementById("numberRange");
var output = document.getElementById("currentMaxCharacters");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}

let entireFile;

function initializeConfig() {
    const initConfig = {
        capital: false,
        numbers: false,
        specialChars: false,
    };
    localStorage.setItem('config', JSON.stringify(initConfig));
    return initConfig;
}

(function loadConfigIIFE() {
    const config = JSON.parse(localStorage.getItem('config')) || initializeConfig();
    document.getElementById('caps').checked = config.capital;
    document.getElementById('numbers').checked = config.numbers;
    document.getElementById('specialChars').checked = config.specialChars;

    const configInputs = document.getElementsByClassName('config');

    for (let i=0; i<configInputs.length; i++) {
        configInputs[i].addEventListener('change', (e) => {
            console.log(e.currentTarget.id);
            switch(e.currentTarget.id) {
                case 'caps':
                    config.capital = e.currentTarget.checked;
                    break;
                case 'numbers':
                    config.numbers = e.currentTarget.checked;
                    break;
                case 'specialChars':
                    config.specialChars = e.currentTarget.checked;
                    break;
                default:
                    break;
            }
            localStorage.setItem('config', JSON.stringify(config));
        });
    }
})();

function showAlert(status, text) {
    const messageDiv = document.getElementById('pageMessages');
    const alert = document.createElement('div');
    alert.className = `alert alert-${status} fade show`;
    alert.setAttribute('role', 'alert');
    alert.appendChild(document.createTextNode(text));
    messageDiv.appendChild(alert);
    setTimeout(function() {
        messageDiv.removeChild(alert);
    }, 2000); 
}

function getNewPassword(entireFile, allowCaps, allowNumbers, allowSpecialChars) {
    let password = '';
    while(password.length < slider.value) {
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
        let remaining = slider.value - password.length;
        if (remaining >= word.length) {
            password += word;
        } else {
            password += word.slice(0,remaining);
        }
        
    }
    console.log(password);
    document.getElementById('newPassword').value = password;
}


function readFile(allowCaps, allowNumbers, allowSpecialChars){
    chrome.runtime.getPackageDirectoryEntry(function(root) {
        root.getFile('diceware.wordlist.asc', {}, function(fileEntry) {
            fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                entireFile = e.target.result.split('\n');
                getNewPassword(entireFile, allowCaps, allowNumbers, allowSpecialChars);
            };
            reader.readAsText(file);
            });
        });
    });
}

document.getElementById('generatePasswordButton').addEventListener('click', (e) => {
    e.preventDefault();
    readFile(document.getElementById('caps').checked, document.getElementById('numbers').checked, document.getElementById('specialChars').checked);
});

document.getElementById('copy').addEventListener('click', (e) => {
    e.preventDefault();
    const copyText = document.getElementById('newPassword');
    if (copyText.value) {
        /* Select the text field */
        copyText.select();
        try {
           /* Copy the text inside the text field */
            document.execCommand("copy");
            showAlert('success', 'Password saved to clipboard!');
        } catch (err) {
            showAlert('danger', 'Uh-oh something went wrong!');
        }
    }
});  




  