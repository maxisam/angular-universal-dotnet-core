# .net core + angular universal on IIS with node server

The goal is

- Create a project with .net core + angular universal

- Running on IIS with node

Reason:

- Microsoft is going to deprecate the current dotnet + angular universal solution https://github.com/dotnet/aspnetcore/issues/12890

- IIS Node is deprecated https://github.com/Azure/iisnode/issues/76?fbclid=IwAR2b-sKVD8ZU2kSnQu_n5QVXTNuhcjzpSes7HbEFLU6vowi4NzD9xzsTnY4

## Steps

### Step 1: Initialize Project

- Create asp.net core web project with Angular from the template

- Upgrade Angular to v10

### Step 2: Add Univeral

```cmd
ng add @nguniversal/express-engine --clientProject client-app
```

#### Build

```cmd
npm run build:ssr
```

#### Run

```cmd
npm run serve:ssr
```

### Step 3 -Use IIS as a reverse proxy

#### Install

- URL Rewrite extension
- Application Request Routing extension

#### Setup Reverse Proxy / Url Rewrite

The basic idea is if the request is not started with **_/api/_**, it goes to Asp.net core web server under IIS. Otherwise, it goes to node server by using IIS as a Reverse Proxy.

- Create a WebSite just like a normal .net core web site

- URL Rewrite -> New Rule -> Reverse Proxy

- Inbound Rules -> Server Name -> [localhost:4000]

- Copy web.config to the virtual folder of the site

- Create 2 server variables to handle gzip issue

  - HTTP_X_ORIGINAL_ACCEPT_ENCODING

  - HTTP_ACCEPT_ENCODING

Note: if it keeps showing 403 error, reinstall the latest URL Rewrite & Application Request Routing extensions

#### Deployment

Usual deployment process just like any dotnet core web app and make sure the web.config transfer correctly (web.config should merge with web.release.config).

#### Setup node environment

- Ensure node is installed

- Use PM2 to handle node life cycle

```cmd
npm install pm2 -g
```

- Run universal from **_ClientApp_** folder (not root folder)

```
npm run serve:ssr:prod
```

**_ Note:_** There are ways to run node app as service or on startup https://github.com/Unitech/pm2/issues/1079
