const { Client, GatewayIntentBits, Partials, Collection, AttachmentBuilder } = require('discord.js');
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType} = require('discord.js');
const config = require('./config.json');
const schedule = require('node-schedule');
const ticketTracking = require('./models/ticketTracking')
const TicketBanModel = require('./models/ticketbanSchema'); 
const { createTicketChannel } = require('./ticket');
const closeTicket = require('./functions/closeTicket')
const claimTicket = require('./functions/claimTicket')
const fs = require('fs');
const ticketbanSchema = require('./models/ticketbanSchema');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent], 
  partials: [Partials.Channel, Partials.GuildMember]

});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

let interval;
let job;

let stopSpamming = false;

client.on('messageCreate', message => {
  if (message.author.id === '1142313630159880255' && message.channel.type === ChannelType.DM) {
    stopSpamming = true;
  }
});

function scheduleJob() {
  if(interval) {
    clearInterval(interval);
    console.log('Scheduled messages stopped.');
  }

let now = new Date();
// Adjust for the time difference between Germany and the UK
let germanyTime = new Date(now.getTime());
let ukTime = new Date(germanyTime.getTime() - (60 * 60 * 1000)); // subtract 1 hour
let nextFriday = new Date(ukTime.getFullYear(), ukTime.getMonth(), ukTime.getDate() + (5 - ukTime.getDay() + 7) % 7, 22, 0, 0);  
let delay = nextFriday - ukTime;

if (delay < 0) {
  delay += 7 * 24 * 60 * 60 * 1000; // if we've passed Friday 22:30 this week, schedule for next week
}



  interval = setTimeout(function(){
    let messageInterval = setInterval(function(){
      if (stopSpamming) {
        clearInterval(messageInterval);
        console.log('Stopped spamming.');
      } else {
        client.users.fetch('1142313630159880255').then(user => user.send('Contrib Reminder'));
        console.log('Message sent.');
      }
    }, 7000);
    scheduleJob(); // reschedule for next week
  }, delay);

  return interval;
}

interval = scheduleJob();


client.on('interactionCreate', async (interaction) => {

  const bannedChecking = interaction.user.id;

  const createdTicket = await ticketTracking.findOne({ userId: bannedChecking, opened: true })

  if (interaction.isButton()) {
    if (interaction.customId === 'open_ticket') {
      const bannedUser = await TicketBanModel.findOne({ userId: bannedChecking }).exec();
      if (bannedUser && bannedUser.ticketBanned) {
        console.log('User is banned from creating tickets. Skipping...');
        await interaction.reply({content: 'You are banned from creating tickets.', ephemeral: true})
        return; 
      } else if (createdTicket){
        await interaction.reply({ content: 'You have already created a ticket.', ephemeral: true });
        return;
      }

      const selectMenu = new StringSelectMenuBuilder({
        custom_id: 'ticket_options',
        max_values: 1,
        options: [
          { label: '🪖 Clan Join', value: '1' },
          { label: '❓ Clan Issues', value: '2' },
          { label: '🥇 Leaderboard', value: '3' },
          { label: '⚽ BladeBall Join', value: '4' },
          { label: '🍉 BloxFruits Join', value: '5' },
          { label: '😅 Role Verification', value: '6' },
          { label: '🆘 Server Support', value: '7' },
          { label: '🔨 Hacker Report', value: '8' },
        ],
      });

      const row = new ActionRowBuilder().addComponents(selectMenu);
      try {
        await interaction.reply({ content: 'Please choose relevant option.', components: [row], ephemeral: true }) 
        setTimeout(() => interaction.deleteReply(), 15000);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.customId === 'close_ticket') {
      const ticketChannel = interaction.channel;
      await closeTicket(interaction, ticketChannel);
      await ticketTracking.findOneAndUpdate(
        { userId: bannedChecking, opened: true },
        { opened: false }
      );
    } else if (interaction.customId === 'claim_ticket') {
      await claimTicket(interaction); 
    }
  } else if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: `There was an error while executing this command!\nIf you want, you can send the following error to our support server.\n\`\`\`js ${error}\`\`\``,
        ephemeral: true,
      });
    }
  } else if (interaction.isStringSelectMenu()) {
    
    if (createdTicket){
      await interaction.reply({ content: 'You have already created a ticket.', ephemeral: true })
      setTimeout(() => interaction.deleteReply(), 5000);
      return;
    }
    if (interaction.customId === 'ticket_options') {
      const selectedValue = interaction.values[0];

      if (selectedValue === '1') {
        const modal = new ModalBuilder()
        .setCustomId('ticket_modal1')
        .setTitle('Ticket Information');


        const IgcQ1 = new TextInputBuilder()
        .setCustomId('questionInput5')
        .setLabel('Please state your current wins in Bedwars')
        .setStyle(TextInputStyle.Short);

      const IgcQ2 = new TextInputBuilder()
        .setCustomId('questionInput4')
        .setLabel('Please state your username (Not Display)')
        .setStyle(TextInputStyle.Short);

      const IgcQ3 = new TextInputBuilder()
        .setCustomId('questionInput3')
        .setLabel('Do you meet the requirements for the clan?')
        .setStyle(TextInputStyle.Short);

      const IgcQ4 = new TextInputBuilder()
        .setCustomId('questionInput2')
        .setLabel('What in game clan are you looking to join?')
        .setStyle(TextInputStyle.Short);

      const IgcQ5 = new TextInputBuilder()
        .setCustomId('questionInput1')
        .setLabel('Have you left your current clan?')
        .setStyle(TextInputStyle.Short);

      const sui1 = new ActionRowBuilder().addComponents(IgcQ1);
      const sui2 = new ActionRowBuilder().addComponents(IgcQ2);
      const sui3 = new ActionRowBuilder().addComponents(IgcQ3);
      const sui4 = new ActionRowBuilder().addComponents(IgcQ4);
      const sui5 = new ActionRowBuilder().addComponents(IgcQ5);

      modal.addComponents(sui1,sui2,sui3,sui4,sui5);

      try {
        interaction.showModal(modal);
      } catch (error) {
        console.error(error);
      }
     } else if (selectedValue === '2') {

        const modal = new ModalBuilder()
        .setCustomId('ticket_modal2')
        .setTitle('Ticket Information');

      const issueQ1 = new TextInputBuilder()
        .setCustomId('issue1')
        .setLabel('What issues are you experiencing?')
        .setStyle(TextInputStyle.Paragraph);

      const issueQ2 = new TextInputBuilder()
        .setCustomId('issue2')
        .setLabel('Which in game clan are you in?')
        .setStyle(TextInputStyle.Short);

      const issueQ3 = new TextInputBuilder()
        .setCustomId('issue3')
        .setLabel('Please state your username (Not Display)')
        .setStyle(TextInputStyle.Short);


      const CS1 = new ActionRowBuilder().addComponents(issueQ1);
      const CS2 = new ActionRowBuilder().addComponents(issueQ2);
      const CS3 = new ActionRowBuilder().addComponents(issueQ3);

      modal.addComponents(CS1,CS2,CS3);

      try {
        interaction.showModal(modal);
      } catch (error) {
        console.error(error);
      }
      } else if (selectedValue === '3') {

        const modal = new ModalBuilder()
        .setCustomId('ticket_modal3')
        .setTitle('Ticket Information');

      const issueQ1 = new TextInputBuilder()
        .setCustomId('leaderboard1')
        .setLabel('Please state your current wins in Bedwars')
        .setStyle(TextInputStyle.Short);

      const issueQ2 = new TextInputBuilder()
        .setCustomId('leaderboard2')
        .setLabel('Please state your username (optional) ')
        .setStyle(TextInputStyle.Short);

      const issueQ3 = new TextInputBuilder()
        .setCustomId('leaderboard3')
        .setLabel('What is your current in game clan?')
        .setStyle(TextInputStyle.Short);


      const CS1 = new ActionRowBuilder().addComponents(issueQ1);
      const CS2 = new ActionRowBuilder().addComponents(issueQ2);
      const CS3 = new ActionRowBuilder().addComponents(issueQ3);

      modal.addComponents(CS1,CS2,CS3);

      try {
        interaction.showModal(modal);
      } catch (error) {
        console.error(error);
      }
       } else if (selectedValue === '4') { 
        const modal = new ModalBuilder()
        .setCustomId('ticket_modal4')
        .setTitle('Ticket Information');

      const issueQ1 = new TextInputBuilder()
        .setCustomId('ball1')
        .setLabel('Please state your current wins in Blade Ball')
        .setStyle(TextInputStyle.Short);

      const issueQ2 = new TextInputBuilder()
        .setCustomId('ball2')
        .setLabel('Please state your username (Not Display) ')
        .setStyle(TextInputStyle.Short);

      const issueQ3 = new TextInputBuilder()
        .setCustomId('ball3')
        .setLabel('What is your current in game clan?')
        .setStyle(TextInputStyle.Short);


      const CS1 = new ActionRowBuilder().addComponents(issueQ1);
      const CS2 = new ActionRowBuilder().addComponents(issueQ2);
      const CS3 = new ActionRowBuilder().addComponents(issueQ3);

      modal.addComponents(CS1,CS2,CS3);

      try {
        interaction.showModal(modal);
      } catch (error) {
        console.error(error);
      }
       } else if (selectedValue === '5') { 

        const modal = new ModalBuilder()
        .setCustomId('ticket_modal5')
        .setTitle('Ticket Information');

      const issueQ1 = new TextInputBuilder()
        .setCustomId('fruits1')
        .setLabel('Please state your current Bounty and Level')
        .setStyle(TextInputStyle.Short);

      const issueQ2 = new TextInputBuilder()
        .setCustomId('fruits2')
        .setLabel('Please state your username (Not Display)')
        .setStyle(TextInputStyle.Short);

      const issueQ3 = new TextInputBuilder()
        .setCustomId('fruits3')
        .setLabel('Have you left your current clan?')
        .setStyle(TextInputStyle.Short);


      const CS1 = new ActionRowBuilder().addComponents(issueQ1);
      const CS2 = new ActionRowBuilder().addComponents(issueQ2);
      const CS3 = new ActionRowBuilder().addComponents(issueQ3);

      modal.addComponents(CS1,CS2,CS3);

      try {
        interaction.showModal(modal);
      } catch (error) {
        console.error(error);
      }

       } else if (selectedValue === '6') { 
        const modal = new ModalBuilder()
        .setCustomId('ticket_modal6')
        .setTitle('Ticket Information');

      const issueQ1 = new TextInputBuilder()
        .setCustomId('roles1')
        .setLabel('Which roles are you applying for?')
        .setStyle(TextInputStyle.Short);

      const issueQ2 = new TextInputBuilder()
        .setCustomId('roles2')
        .setLabel('Are you eligible for the role?')
        .setStyle(TextInputStyle.Short);

      const CS1 = new ActionRowBuilder().addComponents(issueQ1);
      const CS2 = new ActionRowBuilder().addComponents(issueQ2);

      modal.addComponents(CS1,CS2);

      try {
        interaction.showModal(modal);
      } catch (error) {
        console.error(error);
      }
       } else if (selectedValue === '7') { 
      try {
        await createTicketChannel(interaction.guild, interaction.user, 'Server Support');

      } catch (error) {
        console.error(error);
      }
    } else if (selectedValue === '8') { 

      const modal = new ModalBuilder()
      .setCustomId('ticket_modal7')
      .setTitle('Ticket Information');

    const issueQ1 = new TextInputBuilder()
      .setCustomId('hacker1')
      .setLabel('What is the username of the hacker?')
      .setStyle(TextInputStyle.Short);


    const issueQ2 = new TextInputBuilder()
      .setCustomId('hacker2')
      .setLabel('What mode were they hacking in?')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

      const issueQ3 = new TextInputBuilder()
      .setCustomId('hacker3')
      .setLabel('Do you have proof of them hacking?')
      .setStyle(TextInputStyle.Short);

    const CS1 = new ActionRowBuilder().addComponents(issueQ1);
    const CS2 = new ActionRowBuilder().addComponents(issueQ2);
    const CS3 = new ActionRowBuilder().addComponents(issueQ3);
    modal.addComponents(CS1,CS2, CS3);
    try {
      interaction.showModal(modal);
    } catch (error) {
      console.error(error);
    }

     }
    }
  }


  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'ticket_modal1') {
      const question = interaction.fields.getTextInputValue('questionInput5');
      const question2 = interaction.fields.getTextInputValue('questionInput4');
      const question3 = interaction.fields.getTextInputValue('questionInput3');
      const question4 = interaction.fields.getTextInputValue('questionInput2');
      const question5 = interaction.fields.getTextInputValue('questionInput1');
      console.log(question, question2, question3, question4, question5);
      await interaction.deferUpdate();

      const input = interaction.fields.getTextInputValue('questionInput2').toLowerCase()

      const clans = ['vbw','ibw','bww','mbw','hbw','wbw','ybw','cbw'];
      if(!clans.includes(input)){
        return interaction.followUp({content: "Unable to create ticket: Wrong clan input", ephemeral: true})
      }
      await createTicketChannel(interaction.guild, interaction.user, 'IGC Join', question, question2, question3, question4, question5);
      try {

        if (createdTicket === null) {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } else {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } 
      } catch (error) {
        console.error(error);
      } 

    } else if (interaction.customId === 'ticket_modal2') {
      const question = interaction.fields.getTextInputValue('issue1');
      const question2 = interaction.fields.getTextInputValue('issue2');
      const question3 = interaction.fields.getTextInputValue('issue3')
      const input = interaction.fields.getTextInputValue('issue2').toLowerCase();

      await interaction.deferUpdate();
      const clans = ['vbw','ibw','bww','mbw','hbw','wbw','ybw','cbw']
      if(!clans.includes(input)){
       return interaction.followUp({content: "You are not in BWW or a subclan! Join by the first option when creating a ticket!", ephemeral: true})
      }
      await createTicketChannel(interaction.guild, interaction.user, 'Clan Issues', question, question2, question3);

      try {
        if (createdTicket === null) {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } else {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } 
      } catch (error) {
        console.error(error);
      }
      
    } else if (interaction.customId === 'ticket_modal3') {
      const question = interaction.fields.getTextInputValue('leaderboard1');
      const question2 = interaction.fields.getTextInputValue('leaderboard2');
      const question3 = interaction.fields.getTextInputValue('leaderboard3')
      const input = interaction.fields.getTextInputValue('leaderboard3').toLowerCase()
      const questionInt = parseInt(question);

      if(!Number.isInteger(questionInt)) {
        return interaction.reply({content: "That is not a number! Please try again.", ephemeral: true})
      } else if(question < 5000){
        return interaction.reply({content: "Minimum wins to get on leaderboard is 5000!", ephemeral: true})
      }

      const clans = ['vbw','ibw','bww','mbw','hbw','wbw','ybw','cbw']
      if(!clans.includes(input)){
       return interaction.reply({content: "You are not in BWW or a subclan! Join by the first option when creating a ticket!", ephemeral: true})
      }

      await interaction.deferUpdate();

      await createTicketChannel(interaction.guild, interaction.user, 'Leaderboard', question, question2, question3);
      try {

        if (createdTicket === null) {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } else {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } 
      } catch (error) {
        console.error(error);
      } 
    } else if (interaction.customId === 'ticket_modal4') {
      const question = interaction.fields.getTextInputValue('ball1');
      const question2 = interaction.fields.getTextInputValue('ball2');
      const question3 = interaction.fields.getTextInputValue('ball3')

      await interaction.deferUpdate();

      await createTicketChannel(interaction.guild, interaction.user, 'Blade Ball', question, question2, question3);
      try {

        if (createdTicket === null) {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } else {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } 
      } catch (error) {
        console.error(error);
      } 
    } else if (interaction.customId === 'ticket_modal5') {
      const question = interaction.fields.getTextInputValue('fruits1');
      const question2 = interaction.fields.getTextInputValue('fruits2');
      const question3 = interaction.fields.getTextInputValue('fruits3')

      await interaction.deferUpdate();

      await createTicketChannel(interaction.guild, interaction.user, 'Blox Fruits', question, question2, question3);
      try {

        if (createdTicket === null) {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } else {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } 
      } catch (error) {
        console.error(error);
      } 
    } else if (interaction.customId === 'ticket_modal6') {
      const question = interaction.fields.getTextInputValue('roles1');
      const question2 = interaction.fields.getTextInputValue('roles2');
  
      await interaction.deferUpdate();
  
      await createTicketChannel(interaction.guild, interaction.user, 'Role Ver', question, question2);
      try {
  
        if (createdTicket === null) {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } else {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } 
      } catch (error) {
        console.error(error);
      } 
    } else if (interaction.customId === 'ticket_modal7') {
      const question = interaction.fields.getTextInputValue('hacker1');
      const question2 = interaction.fields.getTextInputValue('hacker2');
      const question3 = interaction.fields.getTextInputValue('hacker3')
  console.log(question, question2, question3)
      await interaction.deferUpdate();
  
      await createTicketChannel(interaction.guild, interaction.user, 'Hacker Report', question, question2, question3);
  
      try {
  
        if (createdTicket === null) {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } else {
          const newTicket = new ticketTracking({ userId: bannedChecking, opened: true });
          await newTicket.save();
        } 
      } catch (error) {
        console.error(error);
      } 
    }
  } 
});

client.login(config.token);