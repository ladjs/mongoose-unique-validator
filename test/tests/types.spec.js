const { expect } = require('chai');
const helpers = require('../helpers');
const uniqueValidator = require('../../index.js');

module.exports = function (mongoose) {
  describe('Types', function () {
    afterEach(helpers.afterEach);

    it('uses default validation type', function (done) {
      const User = mongoose.model(
        'User',
        helpers.createUserSchema().plugin(uniqueValidator)
      );

      // Save the first user
      const promise = new User(helpers.USERS[0]).save();
      promise.then(function () {
        // Try saving a duplicate
        new User(helpers.USERS[0]).save().catch(function (err) {
          expect(err.errors.username.kind).to.equal('unique');
          done();
        });
      });
      promise.catch(done);
    });

    it('uses custom type via options', function (done) {
      const User = mongoose.model(
        'User',
        helpers.createUserSchema().plugin(uniqueValidator, {
          type: 'mongoose-unique-validator'
        })
      );

      // Save the first user
      const promise = new User(helpers.USERS[0]).save();
      promise.then(function () {
        // Try saving a duplicate
        new User(helpers.USERS[0]).save().catch(function (err) {
          expect(err.errors.username.kind).to.equal(
            'mongoose-unique-validator'
          );
          expect(err.errors.email.kind).to.equal('mongoose-unique-validator');

          done();
        });
      });
      promise.catch(done);
    });

    it('uses custom type from default plugin configuration', function (done) {
      uniqueValidator.defaults.type = 'mongoose-unique-validator';
      const User = mongoose.model(
        'User',
        helpers.createUserSchema().plugin(uniqueValidator)
      );

      // Save the first user
      const promise = new User(helpers.USERS[0]).save();
      promise.then(function () {
        // Try saving a duplicate
        new User(helpers.USERS[0]).save().catch(function (err) {
          expect(err.errors.username.kind).to.equal(
            'mongoose-unique-validator'
          );
          expect(err.errors.email.kind).to.equal('mongoose-unique-validator');

          done();
        });
      });
      promise.catch(done);
    });
  });
};
