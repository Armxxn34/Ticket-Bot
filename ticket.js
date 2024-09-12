const { ChannelType, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const client = "1236365934877479045"
async function createTicketChannel(guild, user, option, question, question2, question3, question4, question5) {
const TicketCount = require('./models/TicketCount')
let ticketCount = await TicketCount.findOne();
if (!ticketCount) {
  ticketCount = new TicketCount();
}
  if (option === "IGC Join"){
   
    ticketCount.count += 1
    await ticketCount.save();
  const ticketChannel = await guild.channels.create({
    name: `ticket-${ticketCount.count}`,
    type: ChannelType.GuildText,
    parent: '1237017419470471359',
    permissionOverwrites: [
      {
        id: guild.id,
        deny: ['ViewChannel'],
      },
      {
        id: user.id,
        allow: ['ViewChannel'],
      },
      {
        id: '1237021094154866748', // ADMIN ID
        allow: ['ViewChannel'],
      },
      {
        id: client, 
        allow: ['ViewChannel'],
      },
    ],
  });
  
  const welcomeEmbed = new EmbedBuilder()
    .setColor('Green')
    .setDescription(`Support will be with you shortly, In the meantime please provide a **screenshot of your stats** in Roblox Bedwars. \n
    Please be patient until one of our staff team can assist you. \n
    Delete this ticket by clicking with Close Ticket button (In Game Clan Invite)`)

    const questionEmbed = new EmbedBuilder()
    .setColor('Gold')
    .setDescription(`\n  **Please state your current wins in Bedwars** \n \`\`\`${question}\`\`\` \n **Please state your username (Not Display)**  \`\`\`${question2}\`\`\` \n **Do you meet the requirements for the clan?** \`\`\`${question3}\`\`\` \n **What in game clan are you looking to join?** \`\`\`${question4}\`\`\` \n **Have you left your current clan?** \`\`\`${question5}\`\`\``);    
  const closeButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setLabel('Close Ticket')
    .setCustomId('close_ticket');

    const input = question4.toLowerCase()

    let roleId;
  if(input === "vbw"){
  roleId = '1238816311367176222';
} else if(input === "hbw"){
  roleId = '1238169058936094790'; 
} else if(input === "wbw"){
  roleId = '1238816046895468625'; 
} else if(input === "mbw"){
  roleId = '1238815697249898628'; 
} else if(input === "bww"){
  roleId = '1238815716870721547'; 
} else if(input === "cbw"){
  roleId = '1238815745547436093'; 
} else if(input === "ybw"){
  roleId = '1238816029895823420'; 
} else if(input === "ibw"){
  roleId = '1238815830293352519'; 
}


    const addroleButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel('Add Role')
        .setCustomId('add_role')
         
        const actionRow = new ActionRowBuilder()
        .addComponents(closeButton, addroleButton);
    ticketChannel.send({ content: `<@${user.id}> @ticketmanagerrolehere`,embeds: [questionEmbed]})
    ticketChannel.send({ embeds: [welcomeEmbed], components: [actionRow] })

    const filter = (interaction) => interaction.customId === 'add_role' && interaction.isButton();
const collector = ticketChannel.createMessageComponentCollector({ filter });
collector.on('collect', async (interaction) => {
  
    const guildMember = interaction.guild.members.cache.get(interaction.user.id);
    const requiredRoleId = '1237021094154866748'; 

    if (!guildMember.roles.cache.has(requiredRoleId)) {
      return interaction.reply({ content: `You don't have the required role to perform this action.`, ephemeral: true})
    } 

    let clans = {
      'vbw': '1238816311367176222',
      'hbw': '1238169058936094790',
      'wbw': '1238816046895468625',
      'mbw': '1238815697249898628',
      'bww': '1238815716870721547',
      'cbw': '1238815745547436093',
      'ybw': '1238816029895823420',
      'ibw': '1238815830293352519'
    };
    
    let existingRoleId = guildMember.roles.cache.find(role => Object.values(clans).includes(role.id) && role.id !== roleId);
    if (existingRoleId) {
        await guildMember.roles.remove(existingRoleId);
    }

    await guildMember.roles.add(roleId);
    await interaction.reply({ content: `Role added successfully!`, ephemeral: true })    
});

collector.on('end', collected => {
    console.log(`Collected ${collected.size} interactions.`);
});

      
  } else if (option === "Clan Issues"){
    ticketCount.count += 1
    await ticketCount.save();

  const ticketChannel = await guild.channels.create({
    name: `ticket-${ticketCount.count}`,
    type: ChannelType.GuildText,
    parent: '1237017485924896848',
    permissionOverwrites: [
      {
        id: guild.id,
        deny: ['ViewChannel'],
      },
      {
        id: user.id,
        allow: ['ViewChannel'],
      },
      {
        id: '1237021094154866748', // Admin role ID
        allow: ['ViewChannel'],
      },
      {
        id: client, // Admin role ID
        allow: ['ViewChannel'],
      },
    ],
  });
  
  const welcomeEmbed = new EmbedBuilder()
    .setColor('Green')
    .setDescription(`Support will be with you shortly, If you haven't already please **provide 
    an explanation of your issue** regarding the clan. \n
    Delete this ticket by clicking with Close Ticket button`)

    const questionEmbed = new EmbedBuilder()
    .setColor('Gold')
    .setDescription(`\n  **What issue are you experiencing?** \n \`\`\`${question}\`\`\` \n **Which in game IGC are you in?**  \`\`\`${question2}\`\`\` \n **Please state your username (Not Display)** \`\`\`${question3}\`\`\``);    
  const closeButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setLabel('Close Ticket')
    .setCustomId('close_ticket');


  const actionRow = new ActionRowBuilder()
    .addComponents(closeButton);

  ticketChannel.send({content: `<@${user.id}> @ticketmanagerrolehere`,embeds: [questionEmbed]})
  ticketChannel.send({embeds: [welcomeEmbed], components: [actionRow]})

      } else if (option === "Leaderboard"){
   
        ticketCount.count += 1
        await ticketCount.save();
    
      const ticketChannel = await guild.channels.create({
        name: `ticket-${ticketCount.count}`,
        type: ChannelType.GuildText,
        parent: '1237805809921032293',
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ['ViewChannel'],
          },
          {
            id: user.id,
            allow: ['ViewChannel'],
          },
          {
            id: '1237021094154866748', // Admin role ID
            allow: ['ViewChannel'],
          },
          {
            id: client, // Admin role ID
            allow: ['ViewChannel'],
          },
        ],
      });
      
      const welcomeEmbed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(`Support will be with you shortly, In the meantime please provide **evidence proving your claim**.

        Please be patient until one of our staff team can assist you.\n
        Delete this ticket by clicking with Close Ticket button (In Game Clan Invite)`)
    
        const questionEmbed = new EmbedBuilder()
        .setColor('Gold')
        .setDescription(`\n  **Please state your current wins in Bedwars** \n \`\`\`${question}\`\`\` \n **Please state your username (Optional)**  \`\`\`${question2}\`\`\` \n **What is your current in game clan** \`\`\`${question3}\`\`\``);    
      const closeButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel('Close Ticket')
        .setCustomId('close_ticket');
  
      const actionRow = new ActionRowBuilder()
        .addComponents(closeButton);
    
      ticketChannel.send({ content: `<@${user.id}>  @ticketmanagerrolehere`,embeds: [questionEmbed]})
      ticketChannel.send({ embeds: [welcomeEmbed], components: [actionRow]})
    } else if (option === "Blade Ball"){
   
      ticketCount.count += 1
      await ticketCount.save();
  
    const ticketChannel = await guild.channels.create({
      name: `ticket-${ticketCount.count}`,
      type: ChannelType.GuildText,
      parent: '1237017835654353038',
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ['ViewChannel'],
        },
        {
          id: user.id,
          allow: ['ViewChannel'],
        },
        {
          id: '1237021094154866748', // Admin role ID
          allow: ['ViewChannel'],
        },
        {
          id: client, // Admin role ID
          allow: ['ViewChannel'],
        },
      ],
    });
    
    const welcomeEmbed = new EmbedBuilder()
      .setColor('Green')
      .setDescription(`These tickets are specifically for Blade Ball Clan invites, You can create a ticket \n here to be invited to our Blade Ball Clan in Roblox. \n
      Delete this ticket by clicking with Close Ticket button (In Game Clan Invite)`)
  
      const questionEmbed = new EmbedBuilder()
      .setColor('Gold')
      .setDescription(`\n  **Please state your current wins in Blade Ball** \n \`\`\`${question}\`\`\` \n **Please state your username (Not Display)**  \`\`\`${question2}\`\`\` \n **What is your current in game clan** \`\`\`${question3}\`\`\``);    
    const closeButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setLabel('Close Ticket')
      .setCustomId('close_ticket');

      const addroleButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel('Add Role')
      .setCustomId('add_role')

      const filter = (interaction) => interaction.customId === 'add_role' && interaction.isButton();
      const collector = ticketChannel.createMessageComponentCollector({ filter });
      collector.on('collect', async (interaction) => {
        
          const guildMember = interaction.guild.members.cache.get(interaction.user.id);
          const requiredRoleId = '1237021094154866748'; 
          const roleId = "x"
          if (!guildMember.roles.cache.has(requiredRoleId)) {
            return interaction.reply({ content: `You don't have the required role to perform this action.`, ephemeral: true})
          } 
      
          await guildMember.roles.add(roleId);
          await interaction.reply({ content: `Role added successfully!`, ephemeral: true })    
      });

    const actionRow = new ActionRowBuilder()
      .addComponents(closeButton, addroleButton);
  
    ticketChannel.send({ content: `<@${user.id}>  @ticketmanagerrolehere`,embeds: [questionEmbed]})
    ticketChannel.send({ embeds: [welcomeEmbed], components: [actionRow]})
  } else if (option === "Blox Fruits"){
   
    ticketCount.count += 1
    await ticketCount.save();

  const ticketChannel = await guild.channels.create({
    name: `ticket-${ticketCount.count}`,
    type: ChannelType.GuildText,
    parent: '1237017743417413773',
    permissionOverwrites: [
      {
        id: guild.id,
        deny: ['ViewChannel'],
      },
      {
        id: user.id,
        allow: ['ViewChannel'],
      },
      {
        id: '1237021094154866748', // Admin role ID
        allow: ['ViewChannel'],
      },
      {
        id: client, // Admin role ID
        allow: ['ViewChannel'],
      },
    ],
  });
  
  const welcomeEmbed = new EmbedBuilder()
    .setColor('Green')
    .setDescription(`Support will be with you shortly, In the meantime please provide a screenshot of \n your current level and Bounty in Blox Fruits. 

    Please be patient until one of our staff team can assist you.
    Delete this ticket by clicking with Close Ticket button (In Game Clan Invite)`)

    const questionEmbed = new EmbedBuilder()
    .setColor('Gold')
    .setDescription(`\n  **Please state your current Bounty and Level** \n \`\`\`${question}\`\`\` \n **Please state your username (Not Display)**  \`\`\`${question2}\`\`\` \n **Have you left your current clan?** \`\`\`${question3}\`\`\``);    
  const closeButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setLabel('Close Ticket')
    .setCustomId('close_ticket');

    const addroleButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel('Add Role')
    .setCustomId('add_role')

    const filter = (interaction) => interaction.customId === 'add_role' && interaction.isButton();
    const collector = ticketChannel.createMessageComponentCollector({ filter });
    collector.on('collect', async (interaction) => {
      
        const guildMember = interaction.guild.members.cache.get(interaction.user.id);
        const requiredRoleId = '1237021094154866748'; 
        const roleId = "1238190973377450159"
        if (!guildMember.roles.cache.has(requiredRoleId)) {
          return interaction.reply({ content: `You don't have the required role to perform this action.`, ephemeral: true})
        } 
    
        await guildMember.roles.add(roleId);
        await interaction.reply({ content: `Role added successfully!`, ephemeral: true })    
    });

  const actionRow = new ActionRowBuilder()
    .addComponents(closeButton, addroleButton);

  ticketChannel.send({ content: `<@${user.id}>  @ticketmanagerrolehere`,embeds: [questionEmbed]})
  ticketChannel.send({ embeds: [welcomeEmbed], components: [actionRow]})


} else if (option === "Role Ver"){
   
  ticketCount.count += 1
  await ticketCount.save();

const ticketChannel = await guild.channels.create({
  name: `ticket-${ticketCount.count}`,
  type: ChannelType.GuildText,
  parent: '1237017743417413773',
  permissionOverwrites: [
    {
      id: guild.id,
      deny: ['ViewChannel'],
    },
    {
      id: user.id,
      allow: ['ViewChannel'],
    },
    {
      id: '1237021094154866748', // Admin role ID
      allow: ['ViewChannel'],
    },
    {
      id: client,
      allow: ['ViewChannel'],
    },
  ],
});

const welcomeEmbed = new EmbedBuilder()
  .setColor('Green')
  .setDescription(`Support will be with you shortly, Meanwhile please **provide proof** of your claim
  by sending screenshot evidence proving your eligible for the role that you are requesting.

  Delete this ticket by clicking with Close Ticket button (In Game Clan Invite)`)

  const questionEmbed = new EmbedBuilder()
  .setColor('Gold')
  .setDescription(`\n  **Which roles are you applying for?** \n \`\`\`${question}\`\`\` \n **Are you eligible for the role?**  \`\`\`${question2}\`\`\``);    
const closeButton = new ButtonBuilder()
  .setStyle(ButtonStyle.Danger)
  .setLabel('Close Ticket')
  .setCustomId('close_ticket');

const actionRow = new ActionRowBuilder()
  .addComponents(closeButton);

ticketChannel.send({ content: `<@${user.id}>  @ticketmanagerrolehere`,embeds: [questionEmbed]})
ticketChannel.send({ embeds: [welcomeEmbed], components: [actionRow]})
  } else if (option === "Server Support"){
   
    ticketCount.count += 1
    await ticketCount.save();

  const ticketChannel = await guild.channels.create({
    name: `ticket-${ticketCount.count}`,
    type: ChannelType.GuildText,
    parent: '1237805809921032293',
    permissionOverwrites: [
      {
        id: guild.id,
        deny: ['ViewChannel'],
      },
      {
        id: user.id,
        allow: ['ViewChannel'],
      },
      {
        id: '1237021094154866748', // Admin role ID
        allow: ['ViewChannel'],
      },
      {
        id: client, 
        allow: ['ViewChannel'],
      },
    ],
  });
  
  const welcomeEmbed = new EmbedBuilder()
    .setColor('Green')
    .setDescription(`Support will be with you shortly, Until then please be patient until one of our staff
     team can assist you. \n
    Delete this ticket by clicking with Close Ticket button (In Game Clan Invite)`)

    
  const closeButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setLabel('Close Ticket')
    .setCustomId('close_ticket');

  const actionRow = new ActionRowBuilder()
    .addComponents(closeButton);

  ticketChannel.send({ content: `<@${user.id}> Welcome`, embeds: [welcomeEmbed], components: [actionRow]})
  } else if (option === "Hacker Report"){
   
    ticketCount.count += 1
    await ticketCount.save();
  
  const ticketChannel = await guild.channels.create({
    name: `ticket-${ticketCount.count}`,
    type: ChannelType.GuildText,
    parent: '1237017743417413773',
    permissionOverwrites: [
      {
        id: guild.id,
        deny: ['ViewChannel'],
      },
      {
        id: user.id,
        allow: ['ViewChannel'],
      },
      {
        id: '1237021094154866748', // Admin role ID
        allow: ['ViewChannel'],
      },
      {
        id: client,
        allow: ['ViewChannel'],
      },
    ],
  });
  
  const welcomeEmbed = new EmbedBuilder()
    .setColor('Green')
    .setDescription(`Support will be with your shortly, in the meantime please attach **either an mp4 
    file, youtube video or streamable link** etc. Make sure to include the cheaters username 
    and clear evidence within the clip.
  
    Delete this ticket by clicking with Close Ticket button (In Game Clan Invite)`)
  
    const questionEmbed = new EmbedBuilder()
    .setColor('Gold')
    .setDescription(`\n  **Please state the username of the exploiter** \n \`\`\`${question}\`\`\` \n **Which mode were they exploiting in?**\`\`\`${question2}\`\`\` \n **Do you have evidence of them cheating?** \`\`\`${question3}\`\`\``);    
  const closeButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setLabel('Close Ticket')
    .setCustomId('close_ticket');
  
  const actionRow = new ActionRowBuilder()
    .addComponents(closeButton);
  
  ticketChannel.send({ content: `<@${user.id}>  @ticketmanagerrolehere`,embeds: [questionEmbed]})
  ticketChannel.send({ embeds: [welcomeEmbed], components: [actionRow]})
  }
}
module.exports = { createTicketChannel };
