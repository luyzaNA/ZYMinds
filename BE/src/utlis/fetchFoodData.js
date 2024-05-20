const axios = require('axios');
const { MongoClient } = require('mongodb');

const fetchData = async () => {
  try {
    const response = await axios.get('https://api.edamam.com/api/food-database/v2/parser', {
      params: {
        app_id: 'YOUR_APP_ID',
        app_key: 'YOUR_APP_KEY',
        ingr: '1 large apple'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const insertDataIntoMongoDB = async (data) => {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect(); // Connect to MongoDB
    const database = client.db('mydatabase');
    const collection = database.collection('foods');

    const result = await collection.insertOne(data);
    console.log(`${result.insertedCount} documents inserted.`);
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
  } finally {
    await client.close();
  }
};

const main = async () => {
  const data = await fetchData();
  if (data) {
    await insertDataIntoMongoDB(data);
  }
};

main();