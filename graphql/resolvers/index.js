const userResolver = require('./auth');
const bookingResolver = require('./booking');
const eventResolver = require('./event');

module.exports = {
  ...userResolver,
  ...bookingResolver,
  ...eventResolver
}
