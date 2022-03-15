const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');

//Server port
const port = 4242;

const app = express();

//Options to parse body
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Disable CORS
const corsOptions = {
    origin: 'http://localhost:8080',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));

const {authMiddleware} = require('./utils');

//Router import and connection.
app.use('/user', require('./routers/user'));
app.use('/user/check', authMiddleware, require('./routers/userCheck'));
app.use('/participant', authMiddleware, require('./routers/participant'));
app.use('/project', authMiddleware, require('./routers/project'));
app.use('/task', authMiddleware, require('./routers/task'));
app.use('/application', authMiddleware, require('./routers/application'));
app.use('/skill', require('./routers/skill'));
app.use('/role', authMiddleware, require('./routers/role'));

app.listen(port, () => console.log(`Server is on ${port}`));

//Database connection (You need to start DB before connection by CMD or MongoDBCompass)
mongoose.connect(
    'mongodb://localhost:27017/project_control',
    {useNewUrlParser: true, useUnifiedTopology: true},
    (error => console.log(`MongoDB connection ${error ? 'error' : 'success'}`))
);


