# Pre-requisites and Versioning # 
- Node.Js - v16.0.0
- NPM - v7.24.0
- MongoDB - v4.4.16

# Getting started # 
### Clone the repository ###
```
git clone <git lab template url> <project_name>
```
### Install dependencies ###
```
cd <project_name>
npm install
```
### Configure for debug ###
go to .env file and replace your credential
- PORT
- SOCKET_PORT
- MONGODB_HOST
- MONGODB_PORT
- MONGODB_USERNAME
- MONGODB_PASSWORD
- MONGODB_AUTHSOURCE
- MONGODB_DATABSE_NAME

### Build and debug the project ###
```
npm run dev
```
### Configure for production ###
go to ecosystem.config.js file, find the env section and replace your credential
- PORT
- SOCKET_PORT
- MONGODB_HOST
- MONGODB_PORT
- MONGODB_USERNAME
- MONGODB_PASSWORD
- MONGODB_AUTHSOURCE
- MONGODB_DATABSE_NAME

### Build and deploy the project ###
```
npm run production
```

# API endpoints # 

All requests should target domain {{your_domain_or_ip}}/api/
- v1/get_system_information
- v1/register
- v1/login
- v1/search_user
- v1/send_chat
- v1/get_conversations
- v1/get_chats/:receiver_id


After login, All HTTP requests made against this system's API must be validated with an Api Key. You can supply your API Key in REST API calls via a custom header named CHAT_TOKEN.

Parameters and usage please find in postman collection.







