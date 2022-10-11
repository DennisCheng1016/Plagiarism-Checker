## SC Plagiarism API Back-end

First, before running the development server:

Please create .env first to configure, and set up the below parameters

```
PORT =
TOKEN_SIGNATURE =
MONGO_URI =
```

Then, please install all packages

```bash
npm install
```

Finally, you start the server by

```bash
npm start
```

If you see the below message means the node server runs successfully (the default port is 8888)

```bash
Connected to MongoDB
Server is Successfully Running, and App is listening on port 8888
```

Open [http://localhost:8888/](http://localhost:8888/) with your browser to see the result.

[API Documentation](http://localhost:8888/api-docs/) can be accessed at [http://localhost:8888/api-docs/](http://localhost:8888/api-docs/). This documentation is Swagger API to show all APIs provided by the back-end. You can also test APIs on it and see the return values.

## Deploy on Heroku

We deploy our back-end on Heroku. Check out our [SC-Quokka Plagiarism Checker API](https://sc-plagiarism-checker.herokuapp.com/) for more details.
