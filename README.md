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
	<a href="https://github.com/gbkel/kindlefy/actions/workflows/test.yaml">
		<img alt="typescript" src="https://github.com/gbkel/kindlefy/actions/workflows/test.yaml/badge.svg">
	</a>
	<a href="https://github.com/gbkel/kindlefy/actions/workflows/check.yaml">
		<img alt="typescript" src="https://github.com/gbkel/kindlefy/actions/workflows/check.yaml/badge.svg">
	</a>
</p>

## 📌 Overview

That's a way to automatically sync data with your kindle, such as RSS feeds, manga, and too much more.

## 🎩 Getting Started

This repository is a Github Action so you can configure a cron job with Github Actions to run it and sync the contents with your kindle in the way to prefer.

Below you can see an example of a configuration yaml that syncs contents with kindle every day at midnight *(be aware to pass the sender credentials as github secrets to avoid exposing it to the public)*:

```yml
on:
  schedule:
    - cron: '0 0 * * *'

jobs:
  kindlefy:
    runs-on: ubuntu-latest
    name: Sync kindle contents.
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Kindlefy
        uses: gbkel/kindlefy@v1.3.6
        with:
          kindle_email: 'test@kindle.com'
          sender: '[{ "type": "gmail", "email": "test@gmail.com", "password": "password" }]'
          sources: '[{ "type": "manga", "name": "One Piece" }, { "type": "rss", "url": "https://dev.to/feed" }]'
          storage: '[{ "type": "local", "githubAccessToken": "${{ secrets.GITHUB_TOKEN }}" }]'
          no_duplicated_sync: true
```

### Sender

We recommend you to create a new email to use as a sender since some services need to disable extra auth in other to be able to send emails by smtp.

**Core Options**

- ```type``` *- gmail, outlook, smtp -* Type of sender to use.
- ```email``` *- String -* Sender email to use to send the documents to kindle.


**Gmail**

In order to use Gmail, you need to [Disable Unlock Captcha](https://accounts.google.com/DisplayUnlockCaptcha), Disable Two Factor Auth, [Enable Less Secure Apps Access](https://myaccount.google.com/lesssecureapps).

- ```email``` *- String -* The email you use to login in gmail.
- ```password``` *- String -* The password you use to login in gmail.

Example:

```json
{
	"type": "gmail",
	"email": "youremail@gmail.com",
	"password": "yourpassword"
}
```

**Outlook**

- ```email``` *- String -* The email you use to login in outlook.
- ```password``` *- String -* The password you use to login in outlook.

Example:

```json
{
	"type": "outlook",
	"email": "youremail@outlook.com",
	"password": "yourpassword"
}
```

**SMTP**

- ```host``` *- String -* Server host.
- ```user``` *- String -* Server user.
- ```password``` *- String -* Server user's password.
- ```port``` *- String -* Server port.

Example:

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

All the sources has some options to customize it during import. The contents usually come in descending creation order. You are able to see these options below:

**Core Options**

These are the options used by all the existing sources.

- ```order``` *- asc, desc -* Documents ordination.
- ```count``` *- Number -* Amount of documents to sync.
- ```type``` *- manga, rss -* Type of source to sync.

**Manga**

The manga source by default sets ```count: 1``` and ```order: desc``` to retrieve the last most recent chapter.

- ```name``` *- String -* Manga name to search for.

Example:

- Sync the last One Piece manga chapter:

```json
{
	"type": "manga",
	"name": "One Piece"
}
```

**RSS**

The RSS source by default sets ```order: desc``` and ```splitRSSPosts: false``` to return all posts in publish date descending order.

- ```url``` *- String -* RSS feed link.
- ```splitRSSPosts``` *- Boolean -* Set to true if you want every post to be a new document inside your kindle.

Example:

- Sync all the last dev.to feed posts in the same document:

```json
{
	"type": "rss",
	"url": "https://dev.to/feed",
	"splitRSSPosts": false
}
```

### Storage

In case you want to avoid duplicated sync, you can use a storage to save sync history. After adding a storage config, you need to set the 'no_duplicated_sync' environment variable to true in order to use it.

**Core Options**

- ```type``` *- local -* Type of storage to use.

**Local**

It saves the sync history inside the repository this action is currently running on. You need to give Kindlefy a github access token in order to edit the repository, usually when we are using a Github Action, it automatically sets up a variable called 'GITHUB_TOKEN' on the build context that can be used as shown in the .yml example in the start of the readme.

- ```githubAccessToken``` *- String -* Github access token to give the Github Action write/read access to the repository it is running in.

Example:

- Using Github repository to save sync history:

```json
{
	"type": "local",
	"githubAccessToken": "github access token"
}
```

## 🕋 Features

- [X] Send to Kindle by Gmail.

- [X] Send to Kindle by Outlook.

- [X] Send to Kindle by a generic SMTP Server.

- [X] Import Manga.

- [X] Import RSS Feed.

- [X] Import Full Medium RSS Feeds.

- [X] Use a database to persist sync history and avoid data duplication on kindle (such as using MongoDB, Github Repository, etc).

- [X] Turn every rss post into a single document inside Kindle.

- [ ] Choosing which collection to put the documents.

- [ ] Sending more than one document per mail.

- [ ] Using an own Docker Image (builded with the Dockerfile inside this repo) to improve action speed.

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

**Obs:**

- It is needed to have [Calibre](https://calibre-ebook.com/download) installed locally.
