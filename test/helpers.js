const mongoose = require('mongoose');
const uniqueValidator = require('../index.js');

// Helper methods/objects for tests
module.exports = {
  afterEach(done) {
    const collections = Object.keys(mongoose.connection.collections);
    let l = collections.length;
    for (const coll of collections) {
      mongoose.connection.collections[coll].drop(function () {
        l--;

        if (!l) {
          mongoose.models = {};
          mongoose.modelSchemas = {};
          mongoose.connection.models = {};
          done();
        }
      });
    }

    uniqueValidator.defaults = {};
  },

  createUserSchema() {
    return new mongoose.Schema({
      username: {
        type: String,
        unique: true
      },
      email: {
        type: String,
        index: true,
        unique: true
      },
      password: {
        type: String
      }
    });
  },

  createUserCaseInsensitiveSchema() {
    return new mongoose.Schema({
      username: {
        type: String,
        unique: true
      },
      email: {
        type: String,
        index: true,
        unique: true,
        uniqueCaseInsensitive: true
      },
      password: {
        type: String
      }
    });
  },

  createCustomUserSchema() {
    return new mongoose.Schema({
      username: {
        type: String,
        unique: 'Username is already used.'
      },
      email: {
        type: String,
        index: true,
        unique: 'It already exists.'
      },
      password: {
        type: String
      }
    });
  },

  createUserPartialFilterExpressionSchema() {
    return new mongoose.Schema({
      username: {
        type: String
      },
      email: {
        type: String,
        index: {
          unique: true,
          partialFilterExpression: {
            active: true
          }
        }
      },
      password: {
        type: String
      },
      active: {
        type: Boolean
      }
    });
  },

  createCompoundIndexSchema() {
    const schema = new mongoose.Schema({
      username: {
        type: String
      },
      email: {
        type: String,
        index: true
      },
      password: {
        type: String
      }
    });

    schema.index({ username: 1, email: 1 }, { unique: true });

    return schema;
  },

  createCaseInsensitiveCompoundIndexSchema() {
    const schema = new mongoose.Schema({
      username: {
        type: String
      },
      email: {
        type: String,
        index: true
      },
      password: {
        type: String
      }
    });

    schema.index(
      { username: 1, email: 1 },
      { unique: true, uniqueCaseInsensitive: true }
    );

    return schema;
  },

  createCustomCompoundIndexSchema() {
    const schema = new mongoose.Schema({
      username: {
        type: String
      },
      email: {
        type: String,
        index: true
      },
      password: {
        type: String
      }
    });

    schema.index({ username: 1, email: 1 }, { unique: 'Combo in use.' });

    return schema;
  },

  createCustomIdSchema() {
    return new mongoose.Schema({
      position: Number
    });
  },

  createSparseUserSchema() {
    return new mongoose.Schema({
      username: {
        type: String,
        unique: true,
        sparse: true
      },
      email: {
        type: String,
        index: true,
        unique: true
      }
    });
  },

  createNestedFieldUserSchema() {
    return new mongoose.Schema({
      username: {
        type: String,
        unique: true
      },
      contact: {
        email: {
          type: String,
          index: true,
          unique: true
        }
      },
      password: {
        type: String
      }
    });
  },

  createUniqueIDSchemaNonStrict() {
    return new mongoose.Schema(
      {
        uid: {
          type: 'String',
          required: true,
          unique: true
        }
      },
      { strict: false }
    );
  },

  createArrayOfNestedUserSchema() {
    return new mongoose.Schema({
      username: {
        type: String,
        unique: true
      },
      contacts: [
        {
          email: {
            type: String,
            index: true,
            unique: true
          }
        }
      ],
      password: {
        type: String
      }
    });
  },

  createNestedUserSchema(uniqueValidator) {
    const ContactSchema = new mongoose.Schema({
      email: {
        type: String,
        index: true,
        unique: true,
        required: true
      }
    });

    const Schema = new mongoose.Schema({
      username: {
        type: String,
        unique: true
      },
      contact: ContactSchema,
      password: {
        type: String
      }
    });
    Schema.plugin(uniqueValidator);

    return Schema;
  },

  USERS: [
    {
      username: 'JohnSmith',
      email: 'john.smith@gmail.com',
      password: 'j0hnNYb0i'
    },
    {
      username: 'Robert Miller',
      email: 'bob@robertmiller.com',
      password: '@b0B#b0B$b0B%'
    },
    {
      email: 'john.smith@gmail.com'
    },
    {
      email: 'bob@robertmiller.com'
    },
    {
      email: 'john.smith@gmail.com',
      username: 'JohnSmith'
    },
    {
      email: 'john.smith2000@gmail.com',
      username: 'JohnSmith'
    }
  ],

  USERS_REGEX: [
    {
      username: 'JohnSmith0',
      email: 'john0smith@gmail.com',
      password: 'j0hnNYb0i0'
    },
    {
      username: 'JohnSmith',
      email: 'john.smith@gmail.com',
      password: 'j0hnNYb0i'
    }
  ],

  USERS_PARTIAL_FILTER_EXPRESSION: [
    {
      username: 'JaneSmith',
      email: 'jane.smith@gmail.com',
      password: 'j4n3Ru13s',
      active: true
    },
    {
      username: 'Robert Miller',
      email: 'bob@robertmiller.com',
      password: '@b0B#b0B$b0B%',
      active: true
    },
    {
      username: 'JaneSmith',
      email: 'jane.smith@gmail.com',
      password: 'j4n3Ru13s',
      active: false
    }
  ]
};
