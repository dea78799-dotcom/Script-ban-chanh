require('dotenv').config(); // Tải biến môi trường từ file .env

const { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle,
  Events,
  Partials
} = require('discord.js');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel, Partials.Message]
});

// ID Kênh nhận thông báo
const TARGET_CHANNEL_ID = '1547789797668425820';

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot đã sẵn sàng! Đăng nhập với tên: ${c.user.tag}`);
});

// 1. Lệnh !senddm gửi nút bấm
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.content === '!senddm') {
    try {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('btn_updates')
          .setLabel('utdets lần này có gì')
          .setStyle(ButtonStyle.Primary)
      );

      await message.author.send({
        content: '👋 **Chào Admin!** Bấm vào nút bên dưới để nhập nội dung cập nhật mới:',
        components: [row]
      });

      if (message.guild) {
        await message.reply('✅ Đã gửi tin nhắn riêng cho bạn!');
      }
    } catch (error) {
      console.error(error);
      if (message.guild) {
        await message.reply('❌ Không thể gửi DM. Vui lòng kiểm tra cài đặt nhận DM từ máy chủ!');
      }
    }
  }
});

// 2. Xử lý Nút & Form Modal
client.on(Events.InteractionCreate, async (interaction) => {
  
  if (interaction.isButton() && interaction.customId === 'btn_updates') {
    const modal = new ModalBuilder()
      .setCustomId('modal_updates')
      .setTitle('Cập nhật bản mới');

    const updateInput = new TextInputBuilder()
      .setCustomId('input_update_text')
      .setLabel('Nội dung utdets lần này có gì?')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Nhập nội dung cập nhật tại đây...')
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(updateInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === 'modal_updates') {
    const updateContent = interaction.fields.getTextInputValue('input_update_text');

    await interaction.reply({ content: '✅ Đã gửi nội dung utdets lên kênh thành công!', ephemeral: true });

    try {
      const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID);
      if (targetChannel) {
        await targetChannel.send({
          content: `📢 **THÔNG BÁO CẬP NHẬT MỚI (UTDETS)**\n\n${updateContent}`
        });
      }
    } catch (err) {
      console.error('Lỗi khi gửi vào kênh:', err);
    }
  }
});

// Đăng nhập an toàn qua biến môi trường
client.login(process.env.DISCORD_TOKEN);
