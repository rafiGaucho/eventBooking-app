const bcrypt = require('bcrypt');

const Event = require('../../models/event.js');
const User = require('../../models/user.js');
const Booking = require('../../models/booking.js');

const events = async eventIds => {
  try {
    const events = await Event.find({_id: { $in: eventIds}})
    console.log('eventsevents',events);
    return events.map( event =>{
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: userFunc.bind( this, event._doc.creator)
      };
    })
  } catch (e) {
    throw err
  }
}
const singleEvent = async (eventId) => {
  try {
    const event = await Event.findOne({_id: eventId})
    return {
      ...event._doc,
      date: new Date(event._doc.date).toISOString(),
      creator: userFunc.bind( this, event._doc.creator)
    };
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

module.exports = {
  events:async ()=>{
    try {
      const events = await Event.find()
      console.log('events',events);
      return events.map( event => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: userFunc.bind( this, event._doc.creator )
        };
      })
    } catch (e) {
      console.log('error',e);
      throw e
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find()
      return bookings.map(booking => {
        return {
          ...booking._doc,
          user: userFunc.bind( this, booking._doc.user),
          event: singleEvent.bind(this,booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString()
        };
      });
    } catch (e) {
        throw e
    }
  },
  createEvent: async ( args )=>{
    let createdEvents ;
    const event = new Event({
      title : args.eventInput.title,
      description : args.eventInput.description,
      price : args.eventInput.price,
      date : new Date(args.eventInput.date),
      creator: "5ccfa22037a6171132b50bb1"
    })
    try {
      const result = await event.save()
      createdEvents = {
        ...result._doc,
        date: result._doc.date.toString(),
        creator: userFunc.bind( this,result._doc.creator )
      };
      console.log('result',result._doc);
      const user = await User.findById("5ccfa22037a6171132b50bb1")
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
  createUser: async (args)=>{
    try {
      let user = await User.findOne({email: args.userInput.email})
      if (user) {
        throw new Error ('User Already Exist')
      }
      let hashedPassword = await bcrypt.hash(args.userInput.password,12)
      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword
      })
      let result = await newUser.save()
      console.log('resultuser',result._doc);
      return {...result.doc, _id: result._id, email:result.email, password:result.password};
    } catch (e) {
      throw err
    }
  },
  bookEvent:  async (args) => {
    const fetchedEvent = await Event.findOne({_id: args.eventId})
    const booking = new Booking ({
      user: "5ccfa22037a6171132b50bb1" ,
      event: fetchedEvent
    })
    const result = await booking.save()
    console.log(result);
    return {
      ...result._doc,
      user: userFunc.bind( this, booking._doc.user),
      event: singleEvent.bind(this,booking._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString()
    };
  },
  cancelEvent: async (args) => {
    try {
      const booking = await Booking.findById({_id:args.bookingId}).populate('event')
      const event = {
        ...booking.event._doc,
        creator: userFunc.bind( this,booking.event._doc.creator )
      }
      await Booking.deleteOne({_id: args.bookingId});
      return event;
    } catch (e) {
      throw e
    }
  }
}
