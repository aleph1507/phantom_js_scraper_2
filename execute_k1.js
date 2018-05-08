'use strict';

var fs = require('fs');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nabavki.info@gmail.com',
    pass: 'qazxsw.123'
  }
});

var read = [];

var file_emails = 'emails.txt';
var file_settings = 'settings.txt';
global.emails = [];
global.interval = 3;
global.keywords = [];
global.string_emails = '';
global.mails_sent = 0;
var first = true;

var emails_file = fs.readFileSync(file_emails, 'utf8');

global.emails = emails_file.split(',');

for(let i = 0; i<global.emails.length; i++){
  global.string_emails += global.emails[i];
  if(i<global.emails.length - 1)
    global.string_emails += ', ';
}
//
// fs.readFileSync(file_emails, 'utf8', function(err, data){
//   if(err)
//     throw err;
//   global.emails = data.split(',');
//   for(let i = 0; i<global.emails.length; i++){
//     global.string_emails += global.emails[i];
//     if(i<global.emails.length - 1)
//       global.string_emails += ', ';
//   }
// });

var settings_file = fs.readFileSync(file_settings, 'utf8');
var settings = settings_file.split(',');
global.interval = settings[0];
global.interval = parseInt(global.interval, 10);
global.interval *= 1000;
for(let i = 1; i<settings.length; i++)
  keywords.push(settings[i].trim().toLowerCase());

console.log("global.interval : " + global.interval);

for(let i = 0; i<keywords.length; i++){
  console.log(`keywords[${i}] = ${keywords[i]}`);
}
//
// , function(err, data){
//   if(err)
//     throw err;
//   var settings = data.split(',');
//   global.interval = settings[0];
//   global.interval = parseInt(global.interval, 10);
//   global.interval *= 1000;
//   console.log("in readfile global.interval : " + global.interval);
//   for(let i = 1; i<settings.length; i++)
//     keywords.push(settings[i].trim().toLowerCase());
// });

// setTimeout(() => {}, 2000);

// console.log("after readfile global.interval : " + global.interval);

setInterval(() => {
  main();
  // console.log(parseInt(global.interval));
}, global.interval);

function main() {
  // console.log("vo main, interval: " + interval);
  var spawn = require('child_process').spawn;
  var args = ["./k1.js"];

  var options = {};


  var dataString = "";
  let count = 0;
  var phantomExecutable = 'phantomjs';

  if(!child)
    var child = spawn(phantomExecutable, args, options);

  function Uint8ArrToString(myUint8Arr){
      // return String.fromCharCode.apply(null, myUint8Arr);
      return myUint8Arr.toString();
  };

  child.stdout.on('data', function(data) {
    count++;
    if(count == 2){
      var textData = Uint8ArrToString(data);
      this.dataString = textData;
      var send = true;

      setTimeout(() => {
        let dataArr = this.dataString.split('--novred--');
        for(let i = 0; i<dataArr.length; i++)
        {
          for(let j = 0; j<keywords.length; j++){
            if(dataArr[i].toLowerCase().indexOf(keywords[j]) != -1){
              for(let k = 0; k<read.length; k++){
                if(read[k] == dataArr[i])
                  send = false;
              }
              if(send){
                let mailData = dataArr[i].split(' -|- ');
                var mailText = `
                                Број на оглас: ${mailData[0].trim()}\n
                                Договорен орган: ${mailData[1]}\n
                                Предмет на договорот: ${mailData[2]}\n
                                Вид на договорот: ${mailData[3]}\n
                                Вид на постапка: ${mailData[4].trim()}\n
                                Датум на објава: ${mailData[5]}\n
                                Краен рок: ${mailData[6]}\n`;
                read.push(dataArr[i]);
                var mailOptions = {
                  from: 'fsxralek@gmail.com',
                  to: global.string_emails,
                  subject: 'Oglas broj: ' + mailData[0],
                  text: mailText
                };

                console.log('MAILS_SENT : ' + global.mails_sent);

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    globals.mails_sent++;
                    console.log('Email sent: ' + info.response);
                  }
                });

                send = true;
              }
              console.log(dataArr[i]);
            }
          }
        }
      }, 2000);
    }
  });

  child.on('close', function(code) {
      console.log('Process closed with status code: ' + code);
  });

  // child.kill('SIGINT');

}
