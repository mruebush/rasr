define([], ->
  return (game, socket, $) ->
    $('#sendMessage').on('submit', ->
      textBody = $('.chatToSend')
      messageToSend = textBody.val()
      textBody.val('')
      finalMessage = 
        message: messageToSend
        user: game.user
        
      game.message(finalMessage)
      appendMessages(finalMessage)
    )

    template = (message) ->
      "<div class='message'>#{message.user}: #{message.message}</div>"

    appendMessages = (message) ->
      $('.messages').prepend(template(message))
      allMessages = $('.messages').children()
      if (allMessages.length > 100) 
        allMessages[allMessages.length - 1].remove()

    messageListener = ->
      socket.on('message', (data) ->
        console.log data
        appendMessages(data) if data.user isnt game.user
      )

    do messageListener

)