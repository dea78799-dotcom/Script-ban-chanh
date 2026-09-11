const { 
  Client, 
  GatewayIntentBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle,
  Events 
} = require('discord.js');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ] 
});

// ID Kênh nhận thông báo
const TARGET_CHANNEL_ID = '1547789797668425820';

// 1. Lệnh !senddm để bot gửi tin nhắn riêng chứa nút bấm cho Admin
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

      await message.reply('✅ Đã gửi tin nhắn riêng cho bạn!');
    } catch (error) {
      console.error(error);
      await message.reply('❌ Không thể gửi tin nhắn riêng. Hãy kiểm tra xem bạn đã mở quyền nhận DM từ thành viên máy chủ chưa!');
    }
  }
});

// 2. Xử lý khi bấm Nút & Gửi Modal trong tin nhắn riêng
client.on(Events.InteractionCreate, async (interaction) => {
  
  // Khi bấm nút "utdets lần này có gì"
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

  // Khi bấm Gửi form Modal
  if (interaction.isModalSubmit() && interaction.customId === 'modal_updates') {
    const updateContent = interaction.fields.getTextInputValue('input_update_text');

    // Phản hồi riêng cho Admin
    await interaction.reply({ content: '✅ Đã gửi nội dung utdets lên kênh Discord thành công!' });

    // Gửi bài đăng vào kênh Discord chung
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

// Đăng nhập Bot sử dụng biến môi trường DISCORD_TOKEN
client.login(process.env.DISCORD_TOKEN);
    
