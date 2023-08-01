import { EmbedBuilder, InteractionType } from "discord.js";
import { readdirSync } from "fs";

export default {
  name: "interactionCreate",
  execute: async (interaction) => {
    let client = interaction.client;
    if (interaction.type == InteractionType.ApplicationCommand) {
      if (interaction.user.bot) return;

      readdirSync("./commands").forEach(async (file) => {
        const command = await import(`./../commands/${file}`).then(
          (m) => m.default
        );

        if (
          interaction.commandName.toLowerCase() ==
          command.data.name.toLowerCase()
        ) {
          command.run(client, interaction);
        }
      });
    }
  },
};
