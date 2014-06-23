(function() {
  var messages;

  messages = function(game, socket, $) {
    var appendMessages, messageListener, template;
    $('#sendMessage').on('submit', function() {
      var $textBody, finalMessage, messageToSend;
      $textBody = $('.chatToSend');
      messageToSend = $textBody.val();
      $textBody.val('');
      finalMessage = {
        message: messageToSend,
        user: game.user
      };
      return game.message(finalMessage);
    });
    template = function(message) {
      return "<div class='message'>" + message.user + ": " + message.message + "</div>";
    };
    appendMessages = function(message) {
      var $allMessages, $messages;
      $messages = $('.messages');
      $messages.append($(template(message)));
      $allMessages = $messages.children();
      if ($allMessages.length > 50) {
        $allMessages[0].remove();
      }
      return $messages[0].scrollTop = $messages[0].scrollHeight - 100;
    };
    messageListener = function() {
      return socket.on('message', function(data) {
        console.log(data);
        return appendMessages(data);
      });
    };
    $('.chatToSend').on('focus', function() {
      return game.input.keyboard.disabled = true;
    });
    $('.chatToSend').on('focusout', function() {
      return game.input.keyboard.disabled = false;
    });
    return messageListener();
  };

}).call(this);
