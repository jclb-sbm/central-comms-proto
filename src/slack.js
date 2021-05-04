const { WebClient, LogLevel } = require("@slack/web-api");

// Initialize
const client = new WebClient(process.env.SLACK_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});


async function findConversation(name) {
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await client.conversations.list({
      // The token you used to initialize your app
      token: process.env.SLACK_TOKEN
    });

    for (const channel of result.channels) {
      if (channel.name === name) {
        channelId = channel.id;

        // Print result
        console.log("Found conversation ID: " + channelId);

        const result = await client.conversations.history({
          channel: channelId
        });
      
        conversationHistory = result.messages;
      
        // Print results
        console.log(conversationHistory.length + " messages found in " + channelId);
        conversationHistory.map(e => console.log(e))
        // Break from for loop
        break;
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}

async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.SLACK_TOKEN,
      channel: id,
      text: text
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}

publishMessage("C020N0CFVKL", "Hello world :tada:, too easy");

// Find conversation with a specified channel `name`
// findConversation("general");