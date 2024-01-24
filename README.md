** Setup:
1. Create file .env
2. Require: nodejs >= 18
3. Fill content.
   
    PORT=<your_port> -- port run local
   
    DATABASE_URI=mongodb+srv://<username>:<password>@cluster0.lczalmy.mongodb.net/?retryWrites=true&w=majority -- mongodb uri to connect
   
    ACCESS_TOKEN=<your_secret_access_token> -- access token for jwt
   
    REFRESH_TOKEN=<your_secret_refresh_token> -- refresh token for jwt

** Run:
1. Turn on cmd.
2. And run:
   $ npm install
   $ npm run dev
3. Access url: http://localhost:<your_port>/
