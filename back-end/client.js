const { MongoClient } = require("mongodb");
const constants = {
  userName: "mayank",
  password: "Fkyvhn@24",
  db_xero: "db_xero",
};
const uri = `mongodb+srv://${constants.userName}:${constants.password}@cluster0.png3e.mongodb.net/${constants.db_xero}`;
console.log(uri);

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

main();

async function main() {
  try {
    await client.connect();

    await listDatabases(client);
  } catch (e) {
    console.error(e);
  }
  // finally {
  //   await client.close();
  // }
}

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  const cursor = await client
    .db("mayank_db")
    .collection("testing_collection")
    .find({ name: "Mayank" });
  const results = await cursor.toArray();
  console.log(results);
}

exports.client = client;
