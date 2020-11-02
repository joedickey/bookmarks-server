const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { makeBookmarksArray } = require('./bookmarks.fixture')
require('dotenv').config()

describe.only('Bookmarks Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('bookmarks').truncate())

    afterEach('cleanup',() => db('bookmarks').truncate())

    describe(`GET /bookmarks`, () => {
        context(`Given no bookmarks`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/bookmarks')
              .set('Authorization', 'Bearer ' + process.env.API_TOKEN)
              .expect(200, [])
          })
        })
    
        context('Given there are bookmarks in the database', () => {
          const testBookmarks = makeBookmarksArray()
    
          beforeEach('insert bookmarks', () => {
            return db
              .into('bookmarks')
              .insert(testBookmarks)
          })
    
          it('responds with 200 and all of the bookmarks', () => {
            return supertest(app)
              .get('/bookmarks')
              .set('Authorization', 'Bearer ' + process.env.API_TOKEN)
              .expect(200, testBookmarks)
          })
        })
      })

    describe( 'Get /bookmarks/:id', () => {
        context('Given no bookmarks', () => {
            it('responds with 404', () => {
                const bookmarkId = 12345
                return supertest(app)
                    .get(`/bookmarks/${bookmarkId}`)
                    .set('Authorization', 'Bearer ' + process.env.API_TOKEN)
                    .expect(404, {"error":{"message":"Bookmark not found."}})
            })
        })

        context('Given there are bookmarks in the database', () => {
            const testBookmarks = makeBookmarksArray()

            beforeEach('insert bookmarks', () => {
                return db
                  .into('bookmarks')
                  .insert(testBookmarks)
            })

            it('responds with 200 and the specified bookmarks', () => {
                const bookmarkId = 2
                const expectedBookmark = testBookmarks[bookmarkId]
                return supertest(app)
                    .get(`/bookmarks/${bookmarkId}`)
                    .set('Authorization', 'Bearer ' + process.env.API_TOKEN)
                    .expect(200, expectedBookmark)
            })
        })
    })
})