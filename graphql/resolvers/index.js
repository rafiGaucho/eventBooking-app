const bcrypt = require('bcrypt');

const Event = require('../../models/event.js');
const User = require('../../models/user.js');

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
  }
}
