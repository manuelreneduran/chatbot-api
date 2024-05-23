# chatbot-api

## Scripts

Here are the scripts available in this project:

- **build**: Compiles TypeScript code to JavaScript.
- **start**: Runs the compiled JavaScript code using Node.js.
- **start:pm2**: Starts the application using PM2 in production mode with file watching enabled.
- **dev**: Runs the TypeScript code directly using `tsx` for development.
- **dev:pm2**: Starts the application using PM2 in development mode with file watching enabled.
- **migrate**: Runs the latest database migrations using Knex.
- **rollback**: Rolls back the last database migration using Knex.
- **stop:pm2**: Stops the PM2 process for the application.
- **restart:pm2**: Restarts the PM2 process for the application.
- **logs:pm2**: Displays the last 100 lines of logs (both output and error) for the application.
- **logs:pm2:error**: Displays the last 100 lines of error logs for the application.

## Using PM2

PM2 is a production process manager for Node.js applications that ensures your application stays online, restarts automatically if it crashes, and can watch for file changes to restart the application automatically during development.

### Installation

To use PM2, first install it globally:

```bash
npm install -g pm2
```

Start the server

```bash
npm run dev:pm2
```

Save the process

```bash
pm2 save
```

Print out a running log

```bash
npm run logs:pm2
```
