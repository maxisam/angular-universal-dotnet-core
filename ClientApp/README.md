# ClientApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Step 2

```cmd
ng add @nguniversal/express-engine --clientProject client-app
```

### Build

```cmd
npm run build:ssr
```

### Run

```cmd
npm run serve:ssr
```

## Step 3 -Use IIS as reverse proxy

### Install

- URL Rewrite extension
- Application Request Routing extension

### Setup Reverse Proxy

- Create a WebSite

- URL Rewrite -> New Rule -> Reverse Proxy

- Inbound Rules -> Server Name -> [localhost:4000]

- Copy web.config to the virtual folder of the site

- Create 2 server variables to handle gzip issue

  - HTTP_X_ORIGINAL_ACCEPT_ENCODING

  - HTTP_ACCEPT_ENCODING

Note: if it keeps showing 403 error, reinstall the latest URL Rewrite & Application Request Routing extensions

### Deployment

- copy dist folder to server with package.json and web.config

### Setup node environment

- install nodejs

- npm install pm2 -g

- npm run serve:ssr:prod

Note: There are ways to run node app as service or on startup https://github.com/Unitech/pm2/issues/1079
