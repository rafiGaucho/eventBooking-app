const express = require('express');
const bodyParser = require('body-parser');
const {buildSchema} = require('graphql');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Event = require('./models/event.js');
const User = require('./models/user.js');

const app=express()


app.use(bodyParser.json())
// app.get('/',(req,res,next)=>{
//   res.send('hello world!')
// })
app.use('/graphql',graphqlHttp({
  schema:buildSchema(`
    type Event {
      _id : ID!
      title : String!
      description : String!
      price : Float!
      date : String!
      creator: ID
    }
    type User {
      _id: ID!
      email: String!
      password: String
    }
    input EventInput {
      title : String!
      description : String!
      price : Float!
      date : String!
    }
    input UserInput {
      email: String!
      password: String!
    }
    type rootQuery {
      events:[Event!]!
    }
    type rootMutation {
      createEvent(eventInput:EventInput!):Event
      createUser(userInput:UserInput!):User
    }
    schema {
      query:rootQuery
      mutation:rootMutation
    }
  `),
  rootValue:{
    events:()=>{
      return Event.find()
      .then(events=>{
        console.log(events);
        return events.map(event=>{
          return {...event._doc , date: event._doc.date.toString()};
        });
      })
      .catch(e=>{
        console.log('error',e);
        throw e
      })
    },
    createEvent:(args)=>{
      let createdEvents ;
      const event = new Event({
        title : args.eventInput.title,
        description : args.eventInput.description,
        price : args.eventInput.price,
        date : new Date(args.eventInput.date),
        creator: "5ccfa22037a6171132b50bb1"
      })
      return event.save()
      .then((result)=>{
        createdEvents = {...result._doc,date: result._doc.date.toString()};
        console.log('result',result._doc);
        return User.findById("5ccfa22037a6171132b50bb1")
      })
      .then(user=>{
        if (!user) {
          throw new Error(`User doesn't Exist`)
        }
        user.createdEvents.push(event)
        return user.save();
      })
      .then(result=>{
        return createdEvents;
      })
      .catch(e=>{
        console.log('error',e);
        throw e;
      })
    },
    createUser:(args)=>{
      return User.findOne({email: args.userInput.email}).then(user => {
        if (user) {
          throw new Error ('User Already Exist')
        }
        return bcrypt.hash(args.userInput.password,12)
      })
      .then(hashedPassword => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        })
        return user.save()
      })
      .then(result=>{
        console.log('resultuser',result._doc);
        return {...result.doc, _id: result._id, email:result.email, password:result.password};
      })
      .catch(err=>{
        throw err
      });
    }
  },
  graphiql:true
}))

mongoose.connect('mongodb://localhost:27017/event-booking', { useNewUrlParser: true })
.then(()=>{
  app.listen(3000,()=>{
    console.log('server running at port 3000');
  })
})
.catch(e=>{
  console.log('error',e);
})
