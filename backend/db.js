 const mongoose=require('mongoose');
// const mongoURI="mongodb+srv://pawanayyanar435:bale9163@inoteboo.yjm8syw.mongodb.net/"

// const connectToMongo=()=>{
//     mongoose.connect(mongoURI,()=>{
//         console.log("connected successfully")
//     })
// }
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        console.log('Mongo connected')
        mongoose.connect("mongodb+srv://pawanayyanar435:bale9163@inoteboo.yjm8syw.mongodb.net/inotebook") 
       
    } catch(error) {
        console.log(error)
        process.exit()
    }
}

module.exports=connectDB;