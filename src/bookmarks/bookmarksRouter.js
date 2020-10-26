const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

const bookmarks = [
  {
    id: 0,
    title: 'Google',
    url: 'http://www.google.com',
    rating: '3',
    desc: 'Internet-related services and products.'
  },
  {
    id: 1,
    title: 'Thinkful',
    url: 'http://www.thinkful.com',
    rating: '5',
    desc: '1-on-1 learning to accelerate your way to a new high-growth tech career!'
  },
  {
    id: 2,
    title: 'Github',
    url: 'http://www.github.com',
    rating: '4',
    desc: 'brings together the world\'s largest community of developers.'
  }
]

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res
      .status(200)
      .json(bookmarks)
  })
  .post(bodyParser, (req, res) => {
    const { title, url, rating, desc } = req.body;

    if (!title) {
      logger.error('Title is required')
      return res
        .status(400)
        .send('Invalid data')
    }

    if (!url) {
      logger.error('Url is required')
      return res
        .status(400)
        .send('Invalid data')
    }

    if (!rating) {
      logger.error('Rating is required')
      return res
        .status(400)
        .send('Invalid data')
    }

    if (!desc) {
      logger.error('Description is required')
      return res
        .status(400)
        .send('Invalid data')
    }

    if (!Number.isInteger(parseFloat(rating))) {
      logger.error('Rating must be an integer')
      return res
        .status(400)
        .send('Invalid data')
    }

    if (rating < 0 || rating > 5) {
      logger.error('Rating must be a number 0-5')
      return res
        .status(400)
        .send('Invalid data')
    }

    if( !url.toLowerCase().includes("http://www.")) {
      logger.error('Url must be a valid url.')
      return res
        .status(400)
        .send('Invalid data')
    }

    const id = uuid()

    const bookmark = {
      id,
      title,
      url,
      rating,
      desc
    };

    bookmarks.push(bookmark)

    logger.info(`Bookmark with id ${id} created`)
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark)


  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params
    const bookmark = bookmarks.find(bmk => bmk.id == id)

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res  
        .status(404)
        .send('Bookmark not found.')
    }

    res.json(bookmark)
  })
  .delete((req, res) => {
    const { id } = req.params

    const bookmarksIndex = bookmarks.findIndex(bmk => bmk.id == id)

    if (bookmarksIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }

    bookmarks.splice(bookmarksIndex, 1)

    logger.info(`Bookmark with id ${id} deleted.`);
    res
      .status(204)
      .end();
  })

module.exports = bookmarksRouter