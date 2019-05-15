
const Event = require('../../models/event.js');
const User = require('../../models/user.js');

const {dateToString} = require('../../helpers/date');

const transformEvent = event => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: userFunc.bind( this, event._doc.creator)
  };
}
const transformBooking = booking => {
  return {
    ...booking._doc,
    user: userFunc.bind( this, booking._doc.user),
    event: singleEvent.bind(this,booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
}
const events = async eventIds => {
  try {
    const events = await Event.find({_id: { $in: eventIds}})
    console.log('eventsevents',events);
    return events.map( event =>{
      return transformEvent(event);
    })
  } catch (e) {
    throw err
  }
}
const singleEvent = async (eventId) => {
  try {
    const event = await Event.findOne({_id: eventId})
    return transformEvent(event);
  } catch (e) {
    throw e
  }
}
const userFunc = async userId => {
  try {
    const user = await User.findById(userId)
    console.log('user', user);
    return {
      ...user._doc,
      createdEvents: events.bind( this, user._doc.createdEvents )
    };
  } catch (e) {
    throw err
  }
}

exports.transformEvent = transformEvent ;
exports.transformBooking = transformBooking ;
