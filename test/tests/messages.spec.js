const { expect } = require('chai');
const helpers = require('../helpers');
const uniqueValidator = require('../../index.js');

module.exports = function (mongoose) {
  describe('Messages', function () {
    afterEach(helpers.afterEach);

    it('uses default validation message', function (done) {
      const User = mongoose.model(
        'User',
        helpers.createUserSchema().plugin(uniqueValidator)
      );

      // Save the first user
      const promise = new User(helpers.USERS[0]).save();
      promise.then(function () {
        // Try saving a duplicate
        new User(helpers.USERS[0]).save().catch(function (err) {
          expect(err.errors.username.message).to.equal(
            'Error, expected `username` to be unique. Value: `JohnSmith`'
          );
          done();
        });
      });
      promise.catch(done);
    });

    it('uses custom message via options', function (done) {
      const User = mongoose.model(
        'User',
        helpers.createUserSchema().plugin(uniqueValidator, {
          message: 'Path: {PATH}, value: {VALUE}, type: {TYPE}'
        })
      );

      // Save the first user
      const promise = new User(helpers.USERS[0]).save();
      promise.then(function () {
        // Try saving a duplicate
        new User(helpers.USERS[0]).save().catch(function (err) {
          expect(err.errors.username.message).to.equal(
            'Path: username, value: JohnSmith, type: unique'
          );
          expect(err.errors.email.message).to.equal(
            'Path: email, value: john.smith@gmail.com, type: unique'
          );

          done();
        });
      });
      promise.catch(done);
    });

    it('uses custom message from schema configuration', function (done) {
      const User = mongoose.model(
        'User',
        helpers.createCustomUserSchema().plugin(uniqueValidator)
      );

      // Save the first user
      const promise = new User(helpers.USERS[0]).save();
      promise.then(function () {
        // Try saving a duplicate
        new User(helpers.USERS[0]).save().catch(function (err) {
          expect(err.errors.username.message).to.equal(
            'Username is already used.'
          );
          expect(err.errors.email.message).to.equal('It already exists.');

          done();
        });
      });
      promise.catch(done);
    });

    it('uses custom message from default plugin configuration', function (done) {
      uniqueValidator.defaults.message =
        'Path: {PATH}, value: {VALUE}, type: {TYPE}';
      const User = mongoose.model(
        'User',
        helpers.createUserSchema().plugin(uniqueValidator)
      );

      // Save the first user
      const promise = new User(helpers.USERS[0]).save();
      promise.then(function () {
        // Try saving a duplicate
        new User(helpers.USERS[0]).save().catch(function (err) {
          expect(err.errors.username.message).to.equal(
            'Path: username, value: JohnSmith, type: unique'
          );
          expect(err.errors.email.message).to.equal(
            'Path: email, value: john.smith@gmail.com, type: unique'
          );

          done();
        });
      });
      promise.catch(done);
    });
  });
};
