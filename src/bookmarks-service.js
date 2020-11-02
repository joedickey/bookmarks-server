const BookmarksService = {
    getAllBookmarks(db) {
        return db('bookmarks')
            .select('*')
    },
    getById(db, id) {
        return db('bookmarks')
            .select('*')
            .where({ id })
            .first();
    }
};

module.exports = BookmarksService;