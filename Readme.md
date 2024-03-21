# WaveFront

[_Click here to see like website_](http://ec2-43-204-197-217.ap-south-1.compute.amazonaws.com/)

## _Article publishing platform_

A medium like article publishin platform made using MERN stack.

## Technologies Used

- AWS EC2 (for deployment)
- Express (Nodejs)
- React
- Redux
- TailwindCSS
- MongoDB
- Radix UI for some componenets like Modals,etc
- Redis for implementing views .
- Docker (for containerization)
- Nginx (as a reverse proxy and rate-limiter)
- Firebase (for google auth)
- Editorjs (for Notion-like Markdown Editor)

## Features

- Users are able to read,like and comment on articles.
- Users can create an article using modern notion-like editor which also allows users to upload images.
- Implemented Authentication using Refresh Token and Access Tokens.
- Google Signup option available.
- Settings page for users to manage their own profile.
- Users can comment on a blog or can reply on other comment.
- Views on a blog are only counted once every 6 hours. No repeat views under 6 hours window per user.
- Users can follow unfollow authors.
- Dedicated Profile Page where we can see all previour Blogs of the user.
- Search  functionality to search for particular blogs,authors,topics.

## Planned Features

- Notifications on post upload for all the users which are following you.
- Add domain name, to enable https.(can't afford to buy a domain now and lets encrypt does not support aws public dns domain).


