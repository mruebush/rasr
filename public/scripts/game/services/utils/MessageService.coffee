app.service 'Messages', ->
  return (game, socket) ->
    # $('#sendMessage').on('submit', ->
    #   $textBody = $('.chatToSend')
    #   messageToSend = $textBody.val()
    #   $textBody.val('')
    #   finalMessage = 
    #     message: messageToSend
    #     user: game.user
        
    #   game.message(finalMessage)
    #   # appendMessages(finalMessage)
    # )

    # template = (message) ->
    #   "<div class='message'>#{message.user}: #{message.message}</div>"

    # appendMessages = (message) ->
    #   $messages = $('.messages')
    #   $messages.append($(template(message)))
    #   $allMessages = $messages.children()
    #   $allMessages[0].remove() if $allMessages.length > 50
    #   $messages[0].scrollTop = $messages[0].scrollHeight - 100

    # messageListener = ->
    #   socket.on('message', (data) ->
    #     console.log data
    #     appendMessages(data)# if data.user isnt game.user
    #   )

    # $('.chatToSend').on('focus', ->
    #   game.input.keyboard.disabled = true
    # )

    # $('.chatToSend').on('focusout', ->
    #   game.input.keyboard.disabled = false
    # )

    # do messageListener
