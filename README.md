# Simple Telegram ActivityBot

Telegram bot for managing role-based group activities:

## Roles permissions

**SUPERUSER** can:
- Elect admins and change roles to other users

**ADMIN** can:
- Create activities/TODOs
- Delete activities
- Approve _done_ activities and mark it as _completed_

**USER** can:
- Process an activity, mark it as _in progress_
- Mark activity as _done_
- See all activities and their status


## Requirements:

- NodeJS v8+
- MongoDB connection

## Install:

- git clone
- npm i

- Specify environment variables:
  - MONGO_DB_URI: Complete database connection string to MongoDB
  - BOT_TOKEN: Telegram Bot API Token received from BotFather

  - Alternatively, you can specify those in custom environment config file and set NODE_ENV variable with file name

- npm start
