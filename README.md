<p align="center">
	<img src="./logo.png" height="150" width="150" alt="icon example" />
</p>	

<h3 align="center">
  Send diverse contents to your Kindle 📚️
</h3>

<p align="center">
	<a href="https://github.com/microsoft/TypeScript">
		<img alt="typescript" src="https://camo.githubusercontent.com/41c68e9f29c6caccc084e5a147e0abd5f392d9bc/68747470733a2f2f62616467656e2e6e65742f62616467652f547970655363726970742f7374726963742532302546302539462539322541412f626c7565">
	</a>
</p>

## 📌 Overview

That's a way to automatically sync data with your kindle, such as RSS feeds, manga, and too much more.

## 🎩 Getting Started

This repository is a Github Action so you can configure a cron job with Github Actions to run it and sync the contents with your kindle in the way to prefer.

Below you can see an example of a configuration yaml that syncs contents with kindle every hour *(be aware to pass the sender credentials as github secrets to avoid exposing it to the public)*:

```yml
on:
  push:
  schedule:
    - cron: '0 * * * *'

jobs:
  kindlefy:
    runs-on: ubuntu-latest
    name: Sync kindle contents.
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Kindlefy
        uses: gbkel/kindlefy@v1.1.2
        with:
          kindle_email: 'test@kindle.com'
          sender: '[{ "type": "gmail", "email": "test@gmail.com", "password": "password" }]'
          sources: '[{ "type": "manga", "name": "One Piece" }, { "type": "rss", "url": "https://dev.to/feed" }]'
```

### Sender

We recommend you to create a new email to use as a sender since some services need to disable extra auth in other to be able to send emails by smtp.

For now we have the current senders available:

**Gmail**

In order to use Gmail, you need to [Disable Unlock Captcha](https://accounts.google.com/DisplayUnlockCaptcha), Disable Two Factor Auth, [Enable Less Secure Apps Access](https://myaccount.google.com/lesssecureapps).

```json
{
	"type": "gmail",
	"email": "youremail@gmail.com",
	"password": "yourpassword"
}
```

**Outlook**

```json
{
	"type": "outlook",
	"email": "youremail@outlook.com",
	"password": "yourpassword"
}
```

**SMTP**

```json
{
	"type": "smtp",
	"email": "youremail@mail.com",
	"host": "host",
	"user": "user",
	"password": "password",
	"port": "port"
}
```

### Source

For now we have the following sources available to import contents to kindle *(the contents usually come in descending creation order)*:

**Manga**

```json
{
	"type": "manga",
	"name": "some manga name",
	"count": 10 // Chapters count
}
```

**RSS**

```json
{
	"type": "rss",
	"url": "url"
}
```

## 🕋 Features

- [X] Send to Kindle by Gmail

- [X] Send to Kindle by Outlook

- [X] Send to Kindle by a generic SMTP Server

- [X] Import Manga

- [X] Import RSS Feed

## 🔧 Technologies

- Typescript
- Husky
- Lint Staged
- ESLint
- Git Commit Message Linter
- Cheerio
- Nodemailer
- Calibre

## 🚀 Development Environment

You just need to clone this repository inside your machine and run the following commands:

```sh
npm install
npm run dev
```

**Obs:** It is needed to have [Calibre](https://calibre-ebook.com/download) installed locally as well. You can install on Ubuntu by following [this tutorial](https://calibre-ebook.com/download_linux).
