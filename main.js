const fs = require("fs");
const {
  Client,
  Intents,
  WebSocketShard,
  Collection,
  Discord,
  member,
  Message,
  Interaction,
  Guild,
} = require("discord.js");
const dotenv = require("dotenv");
const { token } = require("./config.json");
const path = require("path");
const WOKCommands = require("wokcommands");
const { MessageEmbed } = require("discord.js");
const { hyperlink, hideLinkEmbed } = require("@discordjs/builders");
const puppeteer = require("puppeteer");

let channel;

dotenv.config();
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

// Load mineflayer
const mineflayer = require("mineflayer");
const bot = mineflayer.createBot({
  host: "top.jartex.fun",
  username: "mineflarebot",
  version: "1.8.8",
});

const wok = new WOKCommands(client, {
  commandDir: path.join(__dirname, "commands"),
  mongoUri: process.env.MONGO_URI,
});

const { mineflayer: mineflayerViewer } = require("prismarine-viewer");
const { join } = require("path");
const { time, timeStamp } = require("console");
const { url } = require("inspector");
// const { channel } = require("diagnostics_channel");
bot.once("spawn", () => {
  mineflayerViewer(bot, { port: 3001, firstPerson: false }); // port is the minecraft server port, if first person is false, you get a bird's-eye view
});

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on("ready", async () => {
  console.log(`The discord bot logged in! Username: ${client.user.username}!`);
  console.log(`${client.readyAt}`);
  new WOKCommands(client, {
    commandDir: path.join(__dirname, "commands"),
    mongoUri: process.env.MONGO_URI,
  });
});

client.on("messageCreate", async (message) => {
  if (message.channel.id === "896047293957013524") {
    let owner = "787977601976631336";

    // Only handle messages in specified channel
    let channelreply = await client.channels.fetch("896047293957013524");
    if (message.author.id == client.user.id) return;
    if (message.author.id !== owner) {
      channelreply.send(
        "You can't access this command because this is for bot owners only , for now..!"
      );
      return;
    }

    let channel = await client.channels.fetch("896047293957013524");
    // Ignore messages from the bot itself
    if (message.author.id === client.user.id) return;
    bot.chat(`${message.content}`);
    channel.send(
      `You Have Successfully Sent message` + "`" + `${message.content}` + "`"
    );
  }
});

// Redirect in-game messages to Discord channel
bot.once("login", async () => {
  await bot.chat("/login password2");
  await bot.chat("/server prison");
  await bot.chat("/server prison");
  await bot.chat("/server prison");
});

client.on("guildMemberAdd", async (guildMember) => {
  let rolewelcome = await guildMember.guild.roles.cache.find(
    (role) => role.name === "Fam"
  );
  guildMember.roles.add(rolewelcome);
  let welcomechannel = await client.channels.fetch("897375139321245707");

  welcomechannel.send(
    `${guildMember} Hi Welcome to the Jartex Terminal !` +
      "`" +
      "The Server Is currently on alpha!" +
      "`"
  );
});

bot.on("message", async (message) => {
  let channel = await client.channels.fetch("895708417476423681");
  if (message == "") return;
  if (channel) {
    channel.send("Minecraft : `" + `${message}` + "`");
  }
});

bot.once("kicked",async (message) => {
  let channel = await client.channels.fetch('895708417476423681')
 await client.user.setPresence({
    status: "dnd",
  });
  await client.user.setActivity('Disconnected', { type: 'COMPETING' });

});

bot.once("login", async (message) => {
  let channel = await client.channels.fetch('895708417476423681')
 await client.user.setPresence({
    status: "online",
  });
  await client.user.setActivity('Logged in', { type: 'LISTENING' });

});

client.once("ready", async () => {
  let channel = await client.channels.fetch("896380771403694081");
  if (!channel) {
    console.log(`so ${channel} is a lie`);
  }
});

client.on("messageCreate", async (message, username, matches) => {
  if (message.channel.id == "896380771403694081") return;
  let nowdate = new Date();
  if (message.content === "Minecraft : ``")
    if (message.content.includes("`Minecraft : 0% ▪ ██████████`")) return;
  if (message.content.includes("selling" || "im selling" || "i am selling")) {
    let channel = await client.channels.fetch("896380771403694081");
    channel.send(`Sellers Look Someone is selling! : ${message} `);
  }
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("Minecraft : `0% ▪ ")) {
    await message.delete();
    return;
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.id === "787977601976631336") {
  if (message.content === "!restart") {
    await message.delete();
    process.exit();
  }
}
});

client.on('messageCreate', async (message) => {
  if (message.author.id === "787977601976631336") {
    if (message.content === "!leave") {
      bot.quit();
    }
  }
})
/*
This is some basic web scraping functionality
If you do want to know more about web scraping i would suggest you first learn basic js , then learn more about
pupetteer from their api documentation.
*/
client.on("messageCreate", async (message) => {
  if (message.content.includes("!bans")) {
    let split = message.content.trim().split(" ");
    let user = split[1];
    let channel = await client.channels.fetch("897357176102846465");
    let link = "https://jartexnetwork.com/bans/search/" + `${user}`;
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(`${link}`);
    let punishmentlist = await page.evaluate(() => {
      const plTag = document.querySelector(".td._reason");
      return plTag.innerHTML;
    });
    let punishmenttime = await page.evaluate(() => {
      const ptTag = document.querySelector(".td._date");
      return ptTag.innerHTML;
    });
    let punishmentexpire = await page.evaluate(() => {
      const peTag = document.querySelector(".td._expires");
      return peTag.innerHTML;
    });
    // channel.send(`The Users ban data can be found here ${link} , latest punishment = ${punishmentlist} , was issued in ${punishmenttime}`);
    await browser.close();
    let embed = new MessageEmbed()
      .setTitle(`${user}'s Punishment History(URL)`)
      .setDescription("The Punishment Data Of the requested user")
      .setURL(`${link}`)
      .setColor("BLURPLE")

      .addFields(
        { name: `Punishment History of ${user}`, value: `${punishmentlist}` },
        {
          name: "Time Issued",
          value: `The Time the punishment was issued in is ${punishmenttime}`,
        },
        {
          name: "Expires In",
          value: `Their Punishment expires in ${punishmentexpire}`,
        }
      )
      .setTimestamp()
      .setFooter(`Fulfilled By puppeteer npm`);

    channel.send({ embeds: [embed] });
    channel.send(`${punishmentlist}`);
  }
});
client.on("messageCreate", async (message) => {
  if (message.content.includes("!playercount")) {
    let channel = message.channel;
    let link = "https://mcsrvstat.us/server/top.jartex.fun";
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(`${link}`);

    let playercount = await page.evaluate(() => {
      const pc = document.querySelector(".table.table-borderless");
      return pc.innerText;
    });

    browser.close();
    channel.send("`"+`${playercount}`+"`");
  }
});

client.on('interactionCreate', async (message) => {
  if (message.content.includes(`!report`)) {
    interaction.reply(``)
  }
})

wok.on("databaseConnected", async (connection, state) => {
  const model = connection.models["wokcommands-languages"];

  const results = await model.countDocuments();
  console.log(results);
});

bot.on("kicked", console.log);
bot.on("error", console.log);

// Login Discord bot
client.login(token);
