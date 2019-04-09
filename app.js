const express = require('express');
const bodyParser = require('body-parser');
const {buildSchema} = require('graphql');
const graphqlHttp = require('express-graphql');
const app=express()

app.use(bodyParser.json())
// app.get('/',(req,res,next)=>{
//   res.send('hello world!')
// })
app.use('/graphql',graphqlHttp({
  schema:buildSchema(`
    type rootQuery {
      events:[String!]!
    }
    type rootMutation {
      createEvent(name:String):String
    }
    schema {
      query:rootQuery
      mutation:rootMutation
    }
  `),
  rootValue:{
    events:()=>{
      return ['sports','arts','exam'];
    },
    createEvent:(args)=>{
      const eventName=args.name;
      return eventName;
    }
  },
  graphiql:true
}))
app.listen(3000,()=>{
  console.log('server running at port 3000');
})
