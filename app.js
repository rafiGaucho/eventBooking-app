const express = require('express');
const bodyParser = require('body-parser');
const {buildSchema} = require('graphql');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const Event = require('./models/event.js');

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
    }
    input EventInput {
      title : String!
      description : String!
      price : Float!
      date : String!
    }
    type rootQuery {
      events:[Event!]!
    }
    type rootMutation {
      createEvent(eventInput:EventInput!):Event
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
      const event = new Event({
        title : args.eventInput.title,
        description : args.eventInput.description,
        price : args.eventInput.price,
        date : new Date(args.eventInput.date),
      })
      return event.save()
      .then((result)=>{
        console.log(result);
        return {...result._doc,date: result._doc.date.toString()};
      })
      .catch(e=>{
        console.log('error',e);
        throw e;
      })
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
