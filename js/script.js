var slider = document.getElementById("numberRange");
var output = document.getElementById("currentMaxCharacters");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}

let entireFile;

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

function createAlert(title, summary, details, severity, dismissible, autoDismiss, appendToId) {
    var iconMap = {
      info: "fa fa-info-circle",
      success: "fa fa-thumbs-up",
      warning: "fa fa-exclamation-triangle",
      danger: "fa ffa fa-exclamation-circle"
    };
  
    var iconAdded = false;
  
    var alertClasses = ["alert", "animated", "flipInX"];
    alertClasses.push("alert-" + severity.toLowerCase());
  
    if (dismissible) {
      alertClasses.push("alert-dismissible");
    }
  
    var msgIcon = $("<i />", {
      "class": iconMap[severity] // you need to quote "class" since it's a reserved keyword
    });
  
    var msg = $("<div />", {
      "class": alertClasses.join(" ") // you need to quote "class" since it's a reserved keyword
    });
  
    if (title) {
      var msgTitle = $("<h4 />", {
        html: title
      }).appendTo(msg);
      
      if(!iconAdded){
        msgTitle.prepend(msgIcon);
        iconAdded = true;
      }
    }
  
    if (summary) {
      var msgSummary = $("<strong />", {
        html: summary
      }).appendTo(msg);
      
      if(!iconAdded){
        msgSummary.prepend(msgIcon);
        iconAdded = true;
      }
    }
  
    if (details) {
      var msgDetails = $("<p />", {
        html: details
      }).appendTo(msg);
      
      if(!iconAdded){
        msgDetails.prepend(msgIcon);
        iconAdded = true;
      }
    }
    
  
    if (dismissible) {
      var msgClose = $("<span />", {
        "class": "close", // you need to quote "class" since it's a reserved keyword
        "data-dismiss": "alert",
        html: "<i class='fa fa-times-circle'></i>"
      }).appendTo(msg);
    }
    
    $('#' + appendToId).prepend(msg);
    
    if(autoDismiss){
      setTimeout(function(){
        msg.addClass("flipOutX");
        setTimeout(function(){
          msg.remove();
        },1000);
      }, 5000);
    }
  }

document.getElementById('generatePasswordButton').addEventListener('click', (e) => {
    e.preventDefault();
    readFile(document.getElementById('caps').checked, document.getElementById('numbers').checked, document.getElementById('specialChars').checked);
});

document.getElementById('copy').addEventListener('click', () => {
    const copyText = document.getElementById('newPassword');
    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");

    createAlert('','Nice Work!','Here is a bunch of text about some stuff that happened.','success',true,true,'pageMessages');
});




  