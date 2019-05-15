const Event = require('../../models/event.js');
const User = require('../../models/user.js');
const { transformEvent, transformBooking } = require('./merge.js');

module.exports = {
  events:async ()=>{
    try {
      const events = await Event.find()
      console.log('events',events);
      return events.map( event => {
        return transformEvent(event)
      })
    } catch (e) {
      console.log('error',e);
      throw e
    }
  },
  createEvent: async ( args, req )=>{
    if (!req.isAuth) {
      throw new Error("Unauthenticated")
    }
    let createdEvents ;
    const event = new Event({
      title : args.eventInput.title,
      description : args.eventInput.description,
      price : args.eventInput.price,
      date : new Date(args.eventInput.date),
      creator: req.userId
    })
    try {
      const result = await event.save()
      createdEvents = transformEvent(result)
      console.log('result',result._doc);
      const user = await User.findById(req.userId)
      if (!user) {
        throw new Error(`User doesn't Exist`)
      }
      user.createdEvents.push(event)
      await user.save();
      return createdEvents;
    } catch (e) {
      console.log('error',e);
      throw e;
    }
  },
};
