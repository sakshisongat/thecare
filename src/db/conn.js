// mongoose
const mongoose = require ("mongoose");
const DB = 'mongodb+srv://sakshisongat:2face3book@cluster0.rvukv.mongodb.net/systemdata?retryWrites=true&w=majority'
mongoose.connect(DB,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
}).then(() => {
    console.log("connected to mongodb cloud! :)");
  }).catch((err) => {
    console.log(err);
  });


// mongoose.connect(process.env.MONGODB_URL||"mongodb://localhost/databaseName", {
//   })
//   .then(() => {
//     console.log("connected to mongodb cloud! :)");
//   })
//   .catch((err) => {
//     console.log(err);
//   });