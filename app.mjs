//MODULES
const { Intents, Client } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();

//CONFIGS
const token=process.env.DISCORD_BOT_TOKEN;
const apikey=process.env.API_KEY;

//CLIENT
const client = new Client({intents : [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES]});

//FETCHING API
async function fetchmovie(movie){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': `${apikey}`,
            'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com'
        }
    };
    
    return fetch(`https://online-movie-database.p.rapidapi.com/title/find?q=${movie}`, options)
        .then(response => {
            return response.json();
        })
        .then(response => {
            return response;
        })
        .catch(err => console.error(err));
}

//CLIENT HANDLING
client.on("ready",()=>{
    console.log(`logged in as ${client.user.tag} !`)
})

client.on("messageCreate",msg=>{
    if (msg.author.bot) return false;

    if(msg.content.startsWith("$find")){
        msg.channel.send("Enter movie/series name :").then(()=>{
            return msg.channel.awaitMessages({
                max:1,
                time:30000,
                errors:['time exceeded']
            })
        }).then(res=>{
            var movie=res.first().content.split(" ").join("%20");

            fetchmovie(movie).then(res=>{
                resul=res.results;
                if(res){
                    msg.channel.send("Showing Results :");
                    resul.map((res)=>{
                        if(res.title){
                            const obj=res;

                            const embmsg=new MessageEmbed().setColor('#00FF00')
                                .setTitle(obj.title)
                                .setDescription(`Year in which it was produced is ${obj.year} \n Duration of movie/series`)
                                .setThumbnail(obj.image.url)
                                .setImage(obj.image.url);

                        msg.channel.send({embeds: [embmsg]});
                        }
                    });
                }else{
                    msg.channel.send("No results found");
                }

            });
        })
    }
})


client.login(token);