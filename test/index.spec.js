const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Mongoose Unique Validator', function () {
  before(async function () {
    const mongoServer = await MongoMemoryServer.create();
    return mongoose.connect(mongoServer.getUri(), {
      dbName: 'mongoose-unique-validator'
    });
  });

  require('./tests/validation.spec')(mongoose);
  require('./tests/types.spec.js')(mongoose);
  require('./tests/messages.spec')(mongoose);

  after(function () {
    mongoose.connection.db.dropDatabase();
    return mongoose.disconnect();
  });
});
