const express = require('express');
const bodyParser = require('body-parser');
const {buildSchema} = require('graphql');
const graphqlHttp = require('express-graphql');
const app=express()


let events = []
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
      return events
    },
    createEvent:(args)=>{
      const event={
        _id : Math.random().toString(),
        title : args.eventInput.title,
        description : args.eventInput.description,
        price : args.eventInput.price,
        date : args.eventInput.date,
      }
      console.log(args);
      events.push(event)
      return event;
    }
  },
  graphiql:true
}))
app.listen(3000,()=>{
  console.log('server running at port 3000');
})
