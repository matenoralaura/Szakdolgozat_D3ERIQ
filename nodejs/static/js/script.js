// ========================== greet user proactively ========================
var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

$(document).ready(function () {
  $('.profile_div').toggle();
  $('.widget').toggle();

  //enable this if u have configured the bot to start the conversation.
  showBotTyping();
  $('#userInput').prop('disabled', true);

  //global variables
  PORT = '3005';
  user_id = ID();
  //if you want the bot to start the conversation
  action_trigger();
  //Set cursor in textarea
  $('#userInput').focus();
});


function sendResponseToDb(response) {
  
  for (i = 0; i < response.length; i++) {
    if (response[i].hasOwnProperty('text')) {
      if (response[i].text == "Köszönjük a visszajelzést!"){
        text = $('.userMsg').last().text();
        date = new Date().toLocaleString();

        console.log(text, "cica");

        $.ajax({
          url: 'https://chatbot-rgai3.inf.u-szeged.hu/mongo',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            user_id: user_id,
            description: text,
            createdAt: date
          }),
          success: function () {
            console.log('Sikeres visszajelzés!');
          },
          error: function () {
            console.log('Hiba történt az adatbázisba való feltöltés során.');
          }
        });
        };
      }
    }
};

// Not actually triggering action as it would always create a new mongodb instance
function action_trigger() {
  let msg;
  setTimeout(function () {
    hideBotTyping();
    msg =
      'Üdv! Miben segíthetek?';
    var BotResponse =
      '<p class="botMsg">' +
      msg +
      '</p><div class="clearfix"></div>';
    $(BotResponse).appendTo('.chats').hide().fadeIn(1000);
    scrollToBottomOfResults();
  }, 500);
  $('#userInput').prop('disabled', false);
}

//=====================================	user enter or sends the message =====================
$('.usrInput').on('keyup keypress', function (e) {
  var keyCode = e.keyCode || e.which;

  var text = $('.usrInput').val();
  if (keyCode === 13) {
    if (text == '' || $.trim(text) == '') {
      e.preventDefault();
      return false;
    } else {
      //destroy the existing chart, if yu are not using charts, then comment the below lines
      $('.collapsible').remove();
      if (typeof chatChart !== 'undefined') {
        chatChart.destroy();
      }

      $('.chart-container').remove();
      if (typeof modalChart !== 'undefined') {
        modalChart.destroy();
      }

      $('#paginated_cards').remove();
      $('.suggestions').remove();
      $('.quickReplies').remove();
      $('.usrInput').focus();
      setUserResponse(text);
      send(text);
      e.preventDefault();
      return false;
    }
  }
});

//-------------------voice recording with icon---------------------
$('#micButton').on('click', function (e) {
  oneClickVoiceRecording();
});

$('#sendButton').on('click', function (e) {
  var text = $('.usrInput').val();
  if (text == '' || $.trim(text) == '') {
    $('#userInput').focus();
    e.preventDefault();
    return false;
  } else {

    if (typeof chatChart !== 'undefined') {
      chatChart.destroy();
    }
    $('.chart-container').remove();
    if (typeof modalChart !== 'undefined') {
      modalChart.destroy();
    }

    $('.suggestions').remove();
    $('#paginated_cards').remove();
    $('.quickReplies').remove();
    $('.usrInput').focus();
    setUserResponse(text);
    send(text);
    e.preventDefault();
    return false;
  }
});
$.fn.selectRange = function (start, end) {
  if (end === undefined) {
    end = start;
  }
  return this.each(function () {
    if ('selectionStart' in this) {
      this.selectionStart = start;
      this.selectionEnd = end;
    } else if (this.setSelectionRange) {
      this.setSelectionRange(start, end);
    } else if (this.createTextRange) {
      var range = this.createTextRange();
      range.collapse(true);
      range.moveEnd('character', end);
      range.moveStart('character', start);
      range.select();
    }
  });
};
//==================================== Set user response =====================================
function setUserResponse(message) {
  var UserResponse =
    '<p class="userMsg">' +
    message.trim() +
    ' </p><div class="clearfix"></div>';
  $(UserResponse).appendTo('.chats').show('slow');

  $('.usrInput').val('');
  scrollToBottomOfResults();
  showBotTyping();
  $('.suggestions').remove();
}

//=========== Scroll to the bottom of the chats after new message has been added to chat ======
function scrollToBottomOfResults() {
  var terminalResultsDiv = document.getElementById('chats');
  terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}

//=========== Wait for ws to connect
function waitForSocketConnection(socket, callback){
  setTimeout(
      function () {
          if (socket.readyState === 1) {
              console.log("Connection is made")
              if (callback != null){
                  callback();
              }
          } else {
              console.log("wait for connection...")
              waitForSocketConnection(socket, callback);
          }

      }, 50); // wait 5 milisecond for the connection...
}

//============== send the user message to rasa server =============================================
function send(message) {
  $.ajax({
    url: 'http://localhost:3000/rasa/webhook',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ message: message.trim(), sender: user_id }),
    success: function (botResponse, status) {
      console.log('Response from Rasa: ', botResponse, '\nStatus: ', status);

      // if user wants to restart the chat and clear the existing chat contents
      if (message.toLowerCase() == '/restart') {
        $('#userInput').prop('disabled', false);

        //if you want the bot to start the conversation after restart
        action_trigger();
        return;
      }
      setBotResponse(botResponse);
    },
    error: function (xhr, textStatus, errorThrown) {
      if (message.toLowerCase() == '/restart') {
        return;
      }
      // if there is no response from rasa server
      setBotResponse('');
      console.log('Error from bot end: ', textStatus);
    }
  });
}

//=================== set bot response in the chats ===========================================
function setBotResponse(response) {
  //display bot response after 500 milliseconds
  setTimeout(function () {
    hideBotTyping();
    if (response.length < 1) {
      //if there is no response from Rasa, send  fallback message to the user
      var fallbackMsg = 'Sajnos nem értettem, át tudnád fogalmazni a kérdést?';
      var BotResponse =
        fallbackMsg +
        '</p><div class="clearfix"></div>';
      $(BotResponse).appendTo('.chats').hide().fadeIn(1000);
      scrollToBottomOfResults();      
    } else {
      //if we get response from Rasa
      const res = [];
      for (i = 0; i < response.length; i++) {
        //check if the response contains "text"
        if (response[i].hasOwnProperty('text')) {
          var BotResponse =
            '<p class="botMsg">' +
            response[i].text +
            '</p>' +
            ((response[i].text == "Visszajelzést szeretnél beküldeni?" ||
            response[i].text == "Rendben! A lenti chatboxban megírhatod a véleményed." ||
            response[i].text == "Köszönjük a visszajelzést!" ||
            response[i].text == "Rendben, ezesetben felteheted a kérdésed!" ||
            response[i].text == "Kérdezz nyugodtan!") ?
            '' : '<i class="fa fa-plus" onclick=send("vélemény") aria-hidden="true"></i><i class="fa fa-minus" onclick=send("vélemény") aria-hidden="true"></i>' ) +
            '<div class="clearfix"></div>';
          $(BotResponse).appendTo('.chats').hide().fadeIn(1000);
          if (response[i].text == "Visszajelzést szeretnél beküldeni?"){
            let btn = document.createElement("button");
            let btn2 = document.createElement("button");
            btn.id = "button-igen"
            btn.innerHTML = "Igen";
            btn.onclick = function () {
              setUserResponse("Igen");
              send("Igen");
              this.disabled = true;
              btn2.disabled = true;
            };
            $(btn).appendTo('.chats').hide().fadeIn(1000);

            btn2.id = "button-megsem"
            btn2.innerHTML = "Mégsem";
            btn2.onclick = function () {
              setUserResponse("Mégsem");
              send("Mégsem");
              this.disabled = true;
              btn.disabled = true;
            };
            $(btn2).appendTo('.chats').hide().fadeIn(1000);
          }
          res.push(response[i].text);
          if (response[i].text == "Köszönjük a visszajelzést!"){
            sendResponseToDb(response);
          }
        }
      }
      tts(res.join(' '));
    }
    scrollToBottomOfResults();
  }, 1000);
}

//======================================bot typing animation ======================================
function showBotTyping() {
  var botTyping =
    '<div class="botTyping">' +
    '<div class="bounce1"></div>' +
    '<div class="bounce2"></div>' +
    '<div class="bounce3"></div>' +
    '</div>';
  $(botTyping).appendTo('.chats');
  $('.botTyping').show();
  scrollToBottomOfResults();
}

function hideBotTyping() {
  $('#botAvatar').remove();
  $('.botTyping').remove();
}

//TTS stuff

function concat(arrays) {
  // sum of individual array lengths
  let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

  if (!arrays.length) return null;

  let result = new Uint8Array(totalLength);

  let length = 0;
  for (let array of arrays) {
    result.set(array, length);
    length += array.length;
  }

  return result;
}

const tts = (text) => {
  fetch(
    'https://chatbot-rgai3.inf.u-szeged.hu/flask/tts?' +
      new URLSearchParams({
        q: text
      })
  )
    .then(async (res) => {
      const reader = res.body.getReader();
      let result,
        data = [];
      while (!(result = await reader.read()).done) {
        data.push(result.value);
      }
      data = concat(data);
      return data;
    })
    .then((data) => {
      let blob = new Blob([data], { type: 'audio/wav' });
      let blobUrl = window.URL.createObjectURL(blob);
      if (window.audio !== undefined && !window.audio.paused){
        window.audio.pause();
	setTimeout(() => {}, 20);  
      }	    
      window.audio = new Audio(blobUrl);
      window.audio.controls = false;
      window.audio.play().catch((err) => {
        console.log(err);
      });
    });
};

/*
Speech2Text stuff
*/
const extract_text = (object) => {
  let message = JSON.stringify(object);
  return message.match('"(.*)"')[1];
};

function SpeechtexAsrHandler() {
  this.controlReceived = function (msg) {
    console.log('control');
    console.log('MSG: [' + msg.type + '] ' + msg.msg + ' (' + msg.params + ')');
  };
  this.errorReceived = function (msg) {
    console.log('error');
    console.log('MSG: [' + msg.type + '] ' + msg.msg + ' (' + msg.params + ')');
  };
  this.resultReceived = function (msg) {
    //Modify this
    const extracted_text = extract_text(msg.params);
    if (msg.msg === '0') {    
      document.getElementById('userInput').value = extracted_text;
    } else {
      if (extracted_text === '' || extracted_text.length < 2) return;
      setUserResponse(extracted_text);
      send(extracted_text);
    }
  };
}

function SpeechtexMessage(raw_msg) {
  this.type;
  this.msg;
  this.params = new Array();

  if (raw_msg.indexOf('|') > -1) {
    this.type = raw_msg.substring(0, raw_msg.indexOf('|'));
    if (raw_msg.indexOf(';') > -1) {
      this.msg = raw_msg.substring(
        raw_msg.indexOf('|') + 1,

        raw_msg.indexOf(';')
      );

      raw_msg = raw_msg.substring(raw_msg.indexOf(';') + 1);
      this.params = raw_msg.split(';');
    } else {
      this.msg = raw_msg.substring(raw_msg.indexOf('|') + 1);
    }
  }
}

/*
Voice recording functions in one
*/
let clickNumber = 1;
function oneClickVoiceRecording(){
  if (clickNumber === 1){
    connect('wss:\/\/chatbot-rgai3.inf.u-szeged.hu/socket');
    getModels();
    bindAsrChannel('general_hu');
    clickNumber = 2;
  }
  else if (clickNumber === 2){
    stopDictate();
    disconnect();
    let sendbutton= document.getElementById("sendButton");
    sendbutton.click();
    clickNumber = 1;
  }
}

/*
Change icon
*/
function changeIcon(anchor) {
  var icon = anchor.querySelector("i");
  icon.classList.toggle('fa-microphone');
  icon.classList.toggle('fa-microphone-slash');
}

/*
SpeechTex connection object
*/
function SpeechtexAsrConnection(wsProxyUrl) {
  // Input uzenetek
  const MSG_IN_GENERAL_CONTROL = 'control|';
  const MSG_IN_BIND_OK = 'control|bind-ok';
  const MSG_IN_BIND_FAILED = 'control|bind-failed';
  const MSG_IN_BIND_CONNECT_FAILED = 'control|connect-failed';
  const MSG_IN_LOOPBACK_ID = 'control|loopback-id';
  const MSG_IN_LOOPBACK_STATUS = 'control|loopback-status';
  // Output uzenetek
  const MSG_OUT_RECOG_START = 'control|start';
  const MSG_OUT_RECOG_STOP = 'control|stop';
  const MSG_OUT_BIND_REQUEST = 'control|bind-request';
  const MSG_OUT_DISCONNECT = 'control|disconnect';
  const MSG_OUT_CREATE_LOOPBACK = 'control|create-loopback';
  const MSG_OUT_GET_MODELS = 'control|get-models';

  var ws;
  var asrBindOk = false;
  var recording = false;
  var sampleRate = 48000;
  var loopbackId = '';
  var wsProxyUrl = wsProxyUrl;
  var handler;

  var statusInterval;
  let fromWhere = '';
  const lab = document.getElementById('stt-connect');
  this.connect = function () {
    ws = new WebSocket(wsProxyUrl);

    this.init();
    ws.onmessage = function (e) {
      var msg = e.data;
      // Sikeres ASR kapcsolodas
      if (msg == MSG_IN_BIND_OK){
        asrBindOk = true;
        startDictate();
      }
      // loopback id beallitasa
      else if (msg.indexOf(MSG_IN_LOOPBACK_ID) > -1) {
        loopbackId = msg.substring(msg.indexOf(';') + 1);
      }
      // loopback status uzenetek
      else if (msg.indexOf(MSG_IN_LOOPBACK_STATUS) > -1) {
        var status = parseInt(msg.substring(msg.lastIndexOf(';') + 1));
        if (status != 0) {
          clearInterval(statusInterval);
          statusInterval = undefined;
        }
      }
      else if (msg.startsWith('control|models')) {
        const regexp = /control\|models;general_hu,(\d),/;
        const available_models = msg.match(regexp);
        if (parseInt(available_models[1]) === 0) {
          lab.innerText =
            ' Jelenleg nincs további elérhető Speech to text szál.';
          lab.style.color = 'red';
        } else {
          lab.style.color = '9f9f9f';
          console.log(fromWhere);
          if (fromWhere === 'connect') {
            lab.innerText = ` Sikeres Speech to Text csatlakozás!`;
          } else {
            lab.innerText = ` Jelenleg ${available_models[1]} szál elérhető.`;
          }
        }
      }
      propagate(msg);
    };
  };
  this.setHandler = function (h) {
    handler = h;
  };
  propagate = function (msg) {
    var spMsg = new SpeechtexMessage(msg);
    if (
      !(handler == null) &&
      spMsg.type === 'error' &&
      typeof handler.errorReceived == 'function'
    )
      handler.errorReceived(spMsg);
    else if (
      !(handler == null) &&
      spMsg.type === 'result' &&
      typeof handler.resultReceived == 'function'
    )
      handler.resultReceived(spMsg);
    else if (
      !(handler == null) &&
      spMsg.type === 'control' &&
      typeof handler.controlReceived == 'function'
    )
      handler.controlReceived(spMsg);
  };
  this.init = function () {
    if (hasGetUserMedia()) {
      navigator.getUserMedia(
        { video: false, audio: true },
        function (localMediaStream) {
          var audioContext = window.AudioContext;
          var context = new audioContext();
          var source = context.createMediaStreamSource(localMediaStream);
          sampleRate = context.sampleRate;
          if (!context.createScriptProcessor) {
            node = context.createJavaScriptNode(0, 1, 1);
          } else {
            node = context.createScriptProcessor(0, 1, 1);
          }
          node.onaudioprocess = function (e) {
            if (recording) {
              sendAudioData(e.inputBuffer.getChannelData(0));
            }
          };
          source.connect(node);
          node.connect(context.destination);
        },
        this.getUserMediaError
      );
    }
  };
  this.getUserMediaError = function (e) {};
  this.disconnect = function () {
    if (!(ws == null)) {
      ws.close();
    }
  };
  const sendControl = function (control) {
    if (!(ws == null)){
      if (ws.readyState == 1){
        ws.send(control);
      } else{
        waitForSocketConnection(ws, function(){
          console.log("message sent!!!");
          ws.send(control);
      });
      }
    }
    else propagate('error|001;No connection to Speechtex ASR Proxy.');
  };
  const sendAudioData = function (data) {
    if (!data) return -1;
    var len = data.length,
      i = 0;
    var dataAsInt16Array = new Int16Array(len);
    while (i < len) dataAsInt16Array[i] = convert(data[i++]);

    if (!(ws == null)) ws.send(dataAsInt16Array);
    return 1;
  };
  /*
  Csatlakozas adott modellt futtato felismero csatornahoz
  */
  this.bindAsrChannel = function (model) { //one
    fromWhere = 'connect';
    sendControl(MSG_OUT_GET_MODELS);
    sendControl(MSG_OUT_DISCONNECT);
    sendControl(MSG_OUT_BIND_REQUEST + ';' + model);
  };
  /*
  Felismeres inditasa
  */
  this.startRecognition = function () {
    if (!asrBindOk) {
      return;
    }
    console.log(MSG_OUT_RECOG_START + ';' + sampleRate + ';' + loopbackId);
    sendControl(
      MSG_OUT_RECOG_START + ';' + sampleRate + ';' + loopbackId + ';0;'
    );

    recording = true;
  };
  this.stopRecognition = function () {
    sendControl(MSG_OUT_RECOG_STOP + ';');
    recording = false;
  };
  this.generateLoopback = function (dic) {
    var params = '';
    if (Array.isArray(dic)) {
      for (i = 0; i < dic.length; i++) {
        var dici = dic[i];
        if (Array.isArray(dici) && dici.length >= 2) {
          if (params !== '') params += ';';
          params += dici[0] + '=' + dici[1];
        }
      }
    }

    sendControl(MSG_OUT_CREATE_LOOPBACK + ';' + params);
  };
  this.getModels = function () {
    fromWhere = 'models';
    sendControl(MSG_OUT_GET_MODELS);
  };
}

/*
Egyeb szukseges metodusok
*/
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
function hasGetUserMedia() {
  return !!(
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mediaDevices.getUserMedia ||
    navigator.msGetUserMedia
  );
}
function convert(n) {
  var v = n * 32768;
  return Math.max(-32767, Math.min(32767, v));
}

var spAsrConn;

function connect(ws_addr) {
  spAsrConn = new SpeechtexAsrConnection(ws_addr);
  var handler = new SpeechtexAsrHandler();
  spAsrConn.setHandler(handler);
  spAsrConn.connect();
}
function disconnect() {
  spAsrConn.disconnect();
}
function bindAsrChannel(model) {
  spAsrConn.bindAsrChannel(model);
  // console.log("spAsrCo");
}
function startDictate() {
  spAsrConn.startRecognition();
}
function stopDictate() {
  spAsrConn.stopRecognition();
}
// function uploadDic() {
//   var dic = [
//     ['Saab', 'száb'],
//     ['Toyota', 'tojota'],
//     ['Seat', 'szeát'],
//     ['Mitsubishi', 'micubisi'],
//     ['BMW', 'béemvé']
//   ];

//   spAsrConn.generateLoopback(dic);
// }
function getModels() {
  spAsrConn.getModels();
}
