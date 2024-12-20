const { Client, Events, GatewayIntentBits, Intents } = require("discord.js");
const { botKey } = require("./config.json");
const { exec } = require("node:child_process");
const { spawn } = require("node:child_process");

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
  console.log("Arceus is alive, starting server.");
  serverStart();
});

function serverStart() {
  const channel = client.channels.cache.get("1112805993286484059"); //get channel by ID
  //cool now we just casually have to create a loop of running a screen sh command and then waiting to restart the server after 6 hours of uptime and then repeat. Also catching any ending of the child process.
  //channel.send("Server is resetting in 30 seconds...I recommend you land");
  const command = spawn("sh", ["run.sh"]);
  console.log("process started");
  channel.send("Server is online.");
  command.on("exit", (code) => {
    channel.send("Server has shutdown, restarting now...");
    serverStart();
  });
  command.stdout.on("data", (data) => {
    console.log(data.toString());
  }); //prints console output
  command.stderr.on("data", (data) => {
    console.error(data.toString());
  }); //prints errors
  setTimeout(() => {
    command.stdin.write(
      "/tell @a Server is resetting in 30 seconds...I recommend you land\n"
    );
    setTimeout(() => {
      command.kill();
    }, 30000);
  }, 21600000); //6 hours
}
