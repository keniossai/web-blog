const express = require('express')

const { config, engine } = require('express-edge')

const bodyParser = require('body-parser')

const fileUpload = require('express-fileupload')

const mongoose = require('mongoose')


mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect('mongodb://localhost/web-app')


// Controllers
const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')

const app = express()

// EDGE TEMPLATING ENGINE
config({ cache: process.env.NODE_ENV === 'production'})
app.use(engine)

app.use(fileUpload())

app.use(express.static('public'))
app.set('views', `${__dirname}/views`)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



const validateCreatePostMiddleware = (req, res, next) => {

    if(!(req.files && req.files.image) || !req.body.username || !req.body.title || !req.body.subtitle || !req.body.content){

        return res.redirect('/posts/new')
    }

    next()
}


app.use('/posts/store', validateCreatePostMiddleware)


app.get('/', homePageController)

app.get('/posts/new', createPostController)

app.post('/posts/store', storePostController)

app.get('/post/:id', getPostController)


app.get('/about', (req, res) => {

    res.render('about')
})

app.get('/contact', (req, res) => {

    res.render('contact')
})

app.listen(4000, () => {

    console.log('App is running on port 4000')
})