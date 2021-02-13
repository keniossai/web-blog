const express = require('express')

const { config, engine } = require('express-edge')

const bodyParser = require('body-parser')

const fileUpload = require('express-fileupload')

const expressSession = require('express-session')

const mongoose = require('mongoose')


mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost/web-app')


// Controllers
const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require('./controllers/createUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')


const app = express()

// EXPRESS SESSION

app.use(expressSession({

    secret: 'secret'
    
}))

// EDGE TEMPLATING ENGINE
config({ cache: process.env.NODE_ENV === 'production'})
app.use(engine)

app.use(fileUpload())

app.use(express.static('public'))
app.set('views', `${__dirname}/views`)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



const storePost = require('./middleware/storePost')
app.use('/posts/store', storePost)




app.get('/', homePageController)

app.get('/posts/new', createPostController)

app.post('/posts/store', storePostController)

app.get('/post/:id', getPostController)

app.get('/auth/register', createUserController)

app.post('/users/register', storeUserController)

app.get('/auth/login', loginController)

app.post('/user/login', loginUserController)




app.listen(4000, () => {

    console.log('App is running on port 4000')
})