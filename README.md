# Ideal Place To Work API

## Project overview

```
📦src
 ┣ 📂config
 ┃ ┣ 📂auth
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📜config.js
 ┃ ┗ 📜index.js
 ┣ 📂controllers
 ┃ ┣ 📜AuthenticationController.js
 ┃ ┣ 📜TestController.js
 ┃ ┣ 📜UserController.js
 ┃ ┗ 📜index.js
 ┣ 📂helpers
 ┃ ┣ 📜LogColorHelper.js
 ┃ ┣ 📜LogIconHelper.js
 ┃ ┗ 📜index.js
 ┣ 📂loaders
 ┃ ┣ 📜express.js
 ┃ ┣ 📜index.js
 ┃ ┣ 📜logger.js
 ┃ ┗ 📜mongoose.js
 ┣ 📂models
 ┃ ┣ 📜index.js
 ┃ ┗ 📜userModel.js
 ┣ 📂routes
 ┃ ┣ 📜authRoute.js
 ┃ ┣ 📜index.js
 ┃ ┣ 📜testRoute.js
 ┃ ┗ 📜userRoute.js
 ┣ 📂services
 ┃ ┗ 📜index.js
 ┗ server.jsc
```

## Documentation

The API documentation is provided using `Swagger` and can be found on the following end-point:

```url
GET http://localhost:9000/api-docs/
```
