//  Find all books in Fantacy genre
db.books.find({ genre: "Fantasy" })

// Find all books published after 1850
db.books.find({ published_year: { $gt: 1850 } })

// Find all books written by Paulo Coelho
db.books.find({ author: 'Paulo Coelho' })

// Update the price of the book 'Moby Dick
db.books.updateOne(
  { title: 'Moby Dick' },
  { $set: { price: 10.49 } }
)

// Delete book with the title The Hobbit
db.books.deleteOne({ title: 'The Hobbit' })

// Find books which are in stock and are published after 1850, returning the title author and price excluding the id
db.books.find(
  { in_stock: true, published_year: { $gt: 1850 } },
  { _id: 0, title: 1, author: 1, price: 1 }
)

// Sorting books by price and returnng the id, title, author and price
// Assending order
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 }).sort({ price: 1 })

// Descending order
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 }).sort({ price: -1 })

// Pagnation 5 books per page
db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 })
  .skip(5)
  .limit(5)

// An aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
      bookCount: { $sum: 1 }
    }
  }
])

// An aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      totalBooks: { $sum: 1 }
    }
  },
  { $sort: { totalBooks: -1 } },
  { $limit: 1 }
])

// A pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $project: {
      decade: {
        $subtract: ["$published_year", { $mod: ["$published_year", 10] }]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      bookCount: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])

// Creates an index on the title field
db.books.createIndex({ title: 1 })

//  Creates a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 })

//  Use the explain() method to demonstrate the performance improvement with your indexes
db.books.find({ title: "1984" }).hint({ title: 1 }).explain("executionStats")
