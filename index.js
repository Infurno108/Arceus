const { Client, Events, GatewayIntentBits, Intents } = require("discord.js");
const { botKey } = require("./config.json");
const { exec } = require("node:child_process");
const { spawn } = require("node:child_process");
const si = require("systeminformation");
var processes = "Shit";

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
  console.log("Starting server.");
  serverStart();
});

/*
si.cpuTemperature(cb)
si.cpuCurrentSpeed(cb)
si.mem(cb)
*/

function statusCheck() {
  const channel = client.channels.cache.get("1112805993286484059");
  si.cpuTemperature((data) => {
    console.log("temp:");
    console.log(data);
    if (data.main > 60) {
      console.log("CPU is overheating"); //change this to a discord msg
      channel.send("HELL IS OVERFLOWING THE CPU IS OVERHEATING");
    }
  });
  si.mem((data) => {
    console.log("data");
    console.log(data);
    if (data.used > data.total * 0.8) {
      console.log("Memory is almost full");
      channel.send("MEMORY IS ALMOST FULL");
    }
  });
}

function cleanUp() {
  const channel = client.channels.cache.get("1112805993286484059");
  var list = [];
  var formattedList = [];
  exec("sh scan.sh", (error, stdout, stderr) => {
    //executes the sh script that includes the command to list all processes, and the grep to isolate the mc server processes. In the event these are not the thing causing the core bug, shit...
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    list = stdout.toString().trim().split("root       ");
    //splits on the collumn name? Maybe. idk idc
    for (i = 0; i < list.length; i++) {
      formattedList.push(list[i].split(" ")[0]);
      exec("kill " + formattedList[i]);
      //executes the simple kill command, sometimes -9 is used. This requires the node instance run as sudo.
    }
  });
}

async function serverStart() {
  const channel = client.channels.cache.get("1112805993286484059");
  //cool now we just casually have to create a loop of running a screen sh command and then waiting to restart the server after 6 hours of uptime and then repeat. Also catching any ending of the child process.
  //channel.send("Server is resetting in 30 seconds...I recommend you land");

  const command = spawn("sh", ["run.sh"]); //running the server

  console.log("process started");
  channel.send("Server started. Waiting for 6 hours to restart");

  command.on("exit", (code) => {
    //this is the recursive function. It will restart the server after 6 hours of uptime. This triggers when the sh command const is stopped. (Either through crash or manual stop)
    serverStart();
  });
  command.stdout.on("data", (data) => {
    console.log(data.toString());
    //Simply sends the output of the sh command to the console.
  }); //prints console output
  command.stderr.on("data", (data) => {
    console.error(data.toString());
  }); //unfortunately we have a comical like 21 error messages we need to look into. So we need to see this.
  setTimeout(() => {
    //The timeout is set to: 60 seconds
    //This is the first time out. It will be the grand one that will trigger the reset of the server for safety reasons. When more then 6 people or so are on the server the server will start to lag. (In the future possibly make the timeout dynamic based on the amount of players on the server)
    command.stdin.write(
      "/tell @a Server is resetting in 30 seconds...I recommend you land\n"
    );
    setTimeout(() => {
      cleanUp(); //this will kill all processes on the server using an sh command to read the system information the node module can't read. (isn't that neat :D)
      command.kill();
    }, 30000);
  }, 21600000); //6 hours
}

//30000
//21600000
