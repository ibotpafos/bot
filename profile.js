//profile.js
function setupProfile(bot) {
  bot.command('/profile', async (ctx) => {
    try {
      const userProfile = ctx.from;
      await ctx.reply(`Username: ${userProfile.username}\n`);
      await ctx.reply(`First Name: ${userProfile.first_name}\n`);
      await ctx.reply(`Last Name: ${userProfile.last_name ? userProfile.last_name : '-' }\n`);
    } catch (err) {
      console.error(err);
      ctx.reply('Oops! Something went wrong. Please try again later.');
    }
  });
}

module.exports = { setupProfile };