module.exports = {
    catergory: 'sellers',
    description: 'not a command so no callback',

    callback: ({ message,username,client}) => {
        let channel = client.channels.fetch('896380771403694081')
      if (message.content == 'selling') {
          channel.send = (`Guys Look ${username} is selling ${message}`)
      }
    }
}   