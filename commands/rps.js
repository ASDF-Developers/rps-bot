import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ComponentType,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("rps")
    .addMentionableOption((option) =>
      option.setName("user").setDescription("Mention someone")
    ),
  run: async (client, interaction) => {
    const mentionable = interaction.options.get("user");

    const embed = new EmbedBuilder()
      .setTitle("Rock Paper Scissors")
      .setDescription(`<@${interaction.user.id}> VS <@${mentionable.value}>`);

    const paper = new ButtonBuilder()
      .setCustomId("paper")
      .setLabel("Paper 📰")
      .setStyle(ButtonStyle.Secondary);

    const rock = new ButtonBuilder()
      .setCustomId("rock")
      .setLabel("Rock✊")
      .setStyle(ButtonStyle.Secondary);

    const scissors = new ButtonBuilder()
      .setCustomId("scissors")
      .setLabel("Scissors ✂")
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder().addComponents(rock, paper, scissors);

    const filter = (btnInt) => {
      return (
        interaction.user.id === btnInt.user.id ||
        btnInt.user.id === mentionable.value
      );
    };

    let collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 10000,
      max: 2,
      componentType: ComponentType.Button,
    });

    let user = [];
    collector.on("collect", async (buttonInteraction) => {
      await buttonInteraction.deferReply();
      console.log(buttonInteraction);

      const choice = buttonInteraction.customId;

      user.push({
        id: buttonInteraction.user.id,
        choice,
      });

      console.log(user);
      if (user.length === 2) {
        const user1Choice = user[0].choice;
        const user2Choice = user[1].choice;
        const user1Id = user[0].id;
        const user2Id = user[1].id;
        const winner1Embed = new EmbedBuilder()
          .setTitle("Winner Winner chicken dinner")
          .setDescription(`Winner <@${user1Id}>`)
          .addFields(
            {
              name: `${interaction.user.username}`,
              value: `${user1Choice}`,
              inline: true,
            },
            {
              name: `${buttonInteraction.user.username}`,
              value: `${user2Choice}`,
              inline: true,
            }
          )
          .setImage(
            "https://media.tenor.com/aQfyvkT7qXgAAAAd/skeleton-smoking.gif"
          );
        const winner2Embed = new EmbedBuilder()
          .setTitle("Winner Winner chicken dinner")
          .setDescription(`Winner <@${user2Id}>`)
          .addFields(
            {
              name: `${interaction.user.username}`,
              value: `${user1Choice}`,
              inline: true,
            },
            {
              name: `${buttonInteraction.user.username}`,
              value: `${user2Choice}`,
              inline: true,
            }
          )
          .setImage(
            "https://media.tenor.com/aQfyvkT7qXgAAAAd/skeleton-smoking.gif"
          );
        if (user1Choice === user2Choice) {
          await buttonInteraction.editReply({
            content: `Draw`,
            ephemeral: false,
          });
        } else if (user1Choice === "paper") {
          if (user2Choice === "rock") {
            await buttonInteraction.editReply({
              embeds: [winner1Embed],
              ephemeral: false,
            });
          } else if (user2Choice === "scissors") {
            await buttonInteraction.editReply({
              embeds: [winner2Embed],
              ephemeral: false,
            });
          } else
            await buttonInteraction.editReply({
              content: `Draw`,
              ephemeral: false,
            });
        } else if (user1Choice === "rock") {
          if (user2Choice === "scissors") {
            await buttonInteraction.editReply({
              embeds: [winner1Embed],
              ephemeral: false,
            });
          } else if (user2Choice === "paper") {
            await buttonInteraction.editReply({
              embeds: [winner2Embed],
              ephemeral: false,
            });
          } else
            await buttonInteraction.editReply({
              content: `Draw`,
              ephemeral: false,
            });
        } else {
          if (user2Choice === "paper") {
            await buttonInteraction.editReply({
              embeds: [winner1Embed],
              ephemeral: false,
            });
          } else if (user2Choice === "rock") {
            await buttonInteraction.editReply({
              embeds: [winner2Embed],
              ephemeral: false,
            });
          } else
            await buttonInteraction.editReply({
              content: `Draw`,
              ephemeral: false,
            });
        }

        user = [];
      }
    });

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
