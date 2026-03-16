Tournament Bot – Phone Deployment Guide

1. Go to https://render.com or https://railway.app
2. Create a free account.
3. Create a new project and upload these files.
4. Set Environment Variables:
   TOKEN = your regenerated Discord bot token
   JUDGE_ROLE_ID = 1482925549281345638
   RESULTS_CHANNEL_ID = 1482926411592372356
5. Start the service.

Invite the bot to your server:
https://discord.com/oauth2/authorize?client_id=1482923636682788875&scope=bot%20applications.commands&permissions=3072

Command for judges:
/result team1:TeamA team2:TeamB winner:TeamA