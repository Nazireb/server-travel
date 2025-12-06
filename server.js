const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const mongoose = require("mongoose");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

  mongoose
  .connect(
    "mongodb+srv://Nazire:Nazireb@cluster0.sdzworf.mongodb.net/travelDB?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect to mongodb...", err));


    const flightSchema = new mongoose.Schema({
        name:String,
        img_name:String,
        country:String
    });

    const Flight = mongoose.model("Flight", flightSchema);


/*let flights = [
    {
    "_id": 1,
    "name": "Paris",
    "country": "France",
    "img_name": "paris.avif",
    "short_desc": "Paris is a beautiful city known for its style, culture and charm. Its often called the City of love and is one of the most visted places in the world.",
    "language": "French"
},
{
    "_id": 2,
    "name": "Venice",
    "country": "Italy",
    "img_name": "venice.jpg",
    "short_desc": "Venice is a unique city built on water that offers vistors a peaceful and unforgettable atmosphere that is unlike anywhere else.",
    "language": "Italian"
},
{
    "_id": 3,
    "name": "London",
    "country": "United Kingdom",
    "img_name": "london.jpg",
    "short_desc": "London is a lively city full of history culture and modren day city life. This makes it a favrite destination from travlers around the world.",
    "language": "English"
},
{
    "_id": 4,
    "name": "Chicago",
    "country": "United States",
    "img_name": "chicago.jpg",
    "short_desc": "Chicago is a city on Lake Michigan that provides a strong sense of character and amazing city views.",
    "language": "English"
},
{
    "_id": 5,
    "name": "Las Vegas",
    "country": "United States",
    "img_name": "las-vegas.jpg",
    "short_desc": "Las Vegas is an exciting destination known for is bright lights, lots of energy and plentiful experiences that you will always remember.",
    "language": "English"
},
{
    "_id": 6,
    "name": "Athens",
    "country": "Greece",
    "img_name": "Athens.jpg",
    "short_desc": "A country filled with crystal clear waters, whitewashed villages, and ancient ruins.",
    "language": "Greek"
},
{
    "_id": 7,
    "name": "Montego Bay",
    "country": "Jamaica",
    "img_name": "MontegoBay.jpg",
    "short_desc": "A tropical island known for its beaches, reggae music. You can enjoy warm weather, delicious food and vibrant local culture.",
    "language": "English"
},
{
    "_id": 8,
    "name": "Rio de Janeiro",
    "country": "Brazil",
    "img_name": "Rio.jpg",
    "short_desc": "A lively and colorful full of energy, famous for its Carnvial, beaches, and rainforest.",
    "language": "Portuguese"
}
]*/

app.get("/api/flights", async (req, res) => {
  try {
    const flights = await Flight.find();
    res.send(flights);
  } catch (err) {
    console.error("Error in GET /api/flights:", err);
    res.status(500).send("Error loading flights");
  }
});


app.post("/api/flights", upload.single("img"), async(req,res)=>{
    console.log("in post request");
    const isValidFlight = validateFlight(req.body);

    if(isValidFlight.error){
        console.log("I have an error");
        res.status(400).send(isValidFlight.error.details[0].message);
        return;
    }

    const flight = new Flight({
        name:req.body.name,
        country:req.body.country,
        /*img_name:req.body.img_name*/
    });

    if(req.file){
        flight.img_name = req.file.filename;
    }

    const newFlight = await flight.save();
    res.status(200).send(newFlight);
});

app.put("/api/flights/:id", upload.single("img"), async(req, res)=>{
    const isValidUpdate = validateFlight(req.body);

    if(isValidUpdate.error){
        console.log("Invalid Info");
        res.status(400).send(isValidUpdate.error.details[0].message);
        return;
    }

    const fieldsToUpdate = {
        name : req.body.name,
        country : req.body.country
    }

    if(req.file){
        fieldsToUpdate.img_name = req.file.filename;
    }

    const success = await Flight.updateOne({_id:req.params.id}, fieldsToUpdate);

    if(!success){
        res.status(404).send("We couldnt locate edit");
        return;
    }

    const flight = await Flight.findById(req.params.id);
    res.status(200).send(flight);

});

app.delete("/api/flights/:id", async(req,res)=>{
    const flight = await Flight.findByIdAndDelete(req.params.id);
    
    if(!flight) {
        res.status(404).send("The flight you wanted to delete is unavailable");
        return;
    }

    res.status(200).send(flight);
});

const validateFlight = (flight) => {
    const schema = Joi.object({
        name:Joi.string().min(3).required(),
        country:Joi.string().min(3).required(),
    });

    return schema.validate(flight);
}


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});