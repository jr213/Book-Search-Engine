const express = require('express');
const { ApolloServer } = require('http');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./controllers/schemas');
const routes = require('./routes');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
})
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
app.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})
const startApolloServer = async (typeDefs, resolvers)=>{
  await server.start();
  server.applyMiddleWare({app});
}
db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
startApolloServer(typeDefs, resolvers);