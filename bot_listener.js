const { Client, GatewayIntentBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Partials } = require('discord.js');
const express = require('express');

// Giữ cho Render không tắt Bot (Web server nhỏ)
const app = express();
app.get('/', (req, res) => res.send('Bot online 24/7!'));
app.listen(process.env.PORT || 3000);

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
    partials: [Partials.Channel] 
});

// ID Kênh công khai đăng Update Log (#utdet-script)
const PUBLIC_CHANNEL_ID = '1547789797668425820'; 

client.on('interactionCreate', async interaction => {
    // 1. Khi bạn bấm nút trong tin nhắn riêng (DM) với Bot
    if (interaction.isButton() && interaction.customId === 'write_update_log') {
        const modal = new ModalBuilder()
            .setCustomId('update_log_modal')
            .setTitle('Viết Update Log Mới');

        const logInput = new TextInputBuilder()
            .setCustomId('log_content')
            .setLabel("Nội dung cập nhật lần này là gì?")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Ví dụ: Fix lỗi lag, thêm tính năng auto farm...")
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(logInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
    }

    // 2. Khi bạn bấm gửi (Submit Modal)
    if (interaction.isModalSubmit() && interaction.customId === 'update_log_modal') {
        const logContent = interaction.fields.getTextInputValue('log_content');
        
        try {
            const publicChannel = await client.channels.fetch(PUBLIC_CHANNEL_ID);
            
            // Tự động đăng ra kênh công khai cho mọi người cùng xem
            await publicChannel.send({
                content: `🚀 **THÔNG BÁO CẬP NHẬT MỚI!**\n\n${logContent}\n\n*Cập nhật bởi Admin <@${interaction.user.id}>*`
            });

            await interaction.reply({ content: '✅ Đã đăng Update Log lên kênh công khai thành công!', ephemeral: true });
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: '❌ Có lỗi xảy ra khi đăng bài lên kênh công khai!', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
