const Event = require('../../models/event.js');
const Booking = require('../../models/booking.js');
const { transformEvent, transformBooking } = require('./merge.js');

module.exports = {
  bookings: async (args,req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated")
    }
    try {
      const bookings = await Booking.find()
      return bookings.map(booking => {
        return transformBooking(booking)
      });
    } catch (e) {
        throw e
    }
  },
  bookEvent:  async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated")
    }
    const fetchedEvent = await Event.findOne({_id: args.eventId})
    const booking = new Booking ({
      user: req.userId ,
      event: fetchedEvent
    })
    const result = await booking.save()
    console.log(result);
    return transformBooking(result)
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated")
    }
    try {
      const booking = await Booking.findById({_id:args.bookingId}).populate('event')
      const event = transformEvent(booking.event)
      await Booking.deleteOne({_id: args.bookingId});
      return event;
    } catch (e) {
      throw e
    }
  }
};
