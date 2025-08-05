require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
  console.error("❌ MongoDB error:", err.message);
  process.exit(1);
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log("🚀 Server running at http://localhost:4000/graphql");
});
