const mongoose = require('mongoose');
const mongoURL = 'mongodb+srv://MrMoney:armaanmiah2@cluster0.hrd5w.mongodb.net/BHTickets?retryWrites=true&w=majority';

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Mongoose connected');
}).catch((error) => {
    console.log('Mongo has either disconnected/not connected')
    console.log(error)
  }
)