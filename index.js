const path = require('path')

const express = require('express')

const { config, engine } = require('express-edge')

const bodyParser = require('body-parser')

const fileUpload = require('express-fileupload')

const mongoose = require('mongoose')


mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect('mongodb://localhost/web-app')

const Post = require('./database/models/Post')

const app = express()


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


app.get('/', async (req, res) => {

    const posts = await Post.find({})

    res.render('home', {

        posts

    })
})

app.get('/posts/new', (req, res) => {

    res.render('create')
})

app.post('/posts/store', (req, res) => {

    const { image } = req.files

    image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {

        Post.create({...req.body, image: `/posts/${image.name}`}, (error, post) => {

            res.redirect('/')
        })
    })
})

app.get('/post/:id', async (req, res) => {

    const post = await Post.findById(req.params.id)

    res.render('post', {

        post

    })
})

app.get('/about', (req, res) => {

    res.render('about')
})

app.get('/contact', (req, res) => {

    res.render('contact')
})

app.listen(4000, () => {

    console.log('App is running on port 4000')
})