const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphqlschema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers')

const app=express()

app.use(bodyParser.json())

app.use('/graphql',graphqlHttp({
  schema: graphqlschema,
  rootValue: graphqlResolvers,
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
