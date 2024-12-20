const { Client, Events, GatewayIntentBits, Message } = require("discord.js");
const { botKey } = require("./config.json");
const { exec } = require("child_process");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
  ],
}); //gives intents for ses

client.once(Events.ClientReady, (readyClient) => {
  //once client is ready, simple stuff
  console.log("Arceus is online");
});

client.login(botKey);

client.once("ready", async () => {
  const channel = client.channels.cache.get("1112805993286484059"); //get channel by ID
  //cool now we just casually have to create a loop of running a screen sh command and then waiting to restart the server after 6 hours of uptime and then repeat. Also catching any ending of the child process.
  //channel.send("Server is resetting in 30 seconds...I recommend you land");
  await new Promise((resolve) => setTimeout(resolve, 30000)); //5 seconds
  while (true) {
    exec("screen -XS mc quit", (err, output) => {
      if (err) {
        console.log(err);
      }
    });
    exec(
      "screen -xS mc sh /home/pborrego/Server/pixelmon/run.sh",
      (err, output) => {
        if (err) {
          console.log(err);
          return;
        }
        channel.send("Server is online.");
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 21600000)); //6 hours
  }
});
