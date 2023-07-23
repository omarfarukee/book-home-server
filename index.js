require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xdpsuxi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("books-home");
    const allBooksCollection = db.collection("allBooks");
    const allReviewsCollection = db.collection("allReviews");
    app.get("/allBooks", async (req, res) => {
      const cursor = allBooksCollection.find({});
      const allBooks = await cursor.toArray();

      res.send({ status: true, data: allBooks });
    });

    app.post("/newBooks", async (req, res) => {
      const books = req.body;
      console.log(books);
      const result = await allBooksCollection.insertOne(books);

      res.send(result);
    });

    app.get("/allBooks/:id", async (req, res) => {
      const id = req.params.id;

      const result = await allBooksCollection.findOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.patch("/allBooks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const field = req.body;
      const option = { upsert: true };
      const updatedBooks = {
        $set: {
          Title: field.Title,
          Author: field.Author,
          Genre: field.Genre,
          PublicationDate: field.PublicationDate,
        },
      };
      console.log(
        field.Title,
        field.Author,
        field.Genre,
        field.PublicationDate
      );
      const result = await allBooksCollection.updateOne(
        filter,
        updatedBooks,
        option
      );
      res.send(result);
    });

    app.delete("/allBooks/:id", async (req, res) => {
      const id = req.params.id;

      const result = await allBooksCollection.deleteOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      console.log(reviews);
      const result = await allReviewsCollection.insertOne(reviews);

      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const cursor = allReviewsCollection.find({});
      const reviews = await cursor.toArray();
      console.log(reviews);
      res.send({ status: true, data: reviews });
    });
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { bookId: id };
      console.log(query);
      const result = await allReviewsCollection.find(query).toArray();
      res.send(result);
    });
    //
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("hello books-home");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
