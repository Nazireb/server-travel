const express = require("express");
const cors = require("cors");
const multer = require("multer");
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

let flights = [
    {
    "_id": 1,
    "name": "Paris",
    "country": "France",
    "img_name": "images/paris.avif",
    "short-desc": "Paris is a beautiful city known for its style, culture and charm. Its often called the City of love and is one of the most visted places in the world.",
    "language": "French"
},
{
    "_id": 2,
    "name": "Venice",
    "country": "Italy",
    "img_name": "images/venice.jpg",
    "short-desc": "Venice is a unique city built on water that offers vistors a peaceful and unforgettable atmosphere that is unlike anywhere else.",
    "language": "Italian"
},
{
    "_id": 3,
    "name": "London",
    "country": "United Kingdom",
    "img_name": "images/london.jpg",
    "short-desc": "London is a lively city full of history culture and modren day city life. This makes it a favrite destination from travlers around the world.",
    "language": "English"
},
{
    "_id": 4,
    "name": "Chicago",
    "country": "United States",
    "img_name": "images/chicago.jpg",
    "short-desc": "Chicago is a city on Lake Michigan that provides a strong sense of character and amazing city views.",
    "language": "English"
},
{
    "_id": 5,
    "name": "Las Vegas",
    "country": "United States",
    "img_name": "images/las-vegas.jpg",
    "short-desc": "Las Vegas is an exciting destination known for is bright lights, lots of energy and plentiful experiences that you will always remember.",
    "language": "English"
},
{
    "_id": 6,
    "name": "Athens",
    "country": "Greece",
    "img_name": "images/Athens.jpg",
    "short-desc": "A country filled with crystal clear waters, whitewashed villages, and ancient ruins.",
    "language": "Greek"
},
{
    "_id": 7,
    "name": "Montego Bay",
    "country": "Jamaica",
    "img_name": "images/MontegoBay.jpg",
    "short-desc": "A tropical island known for its beaches, regggae music. You can enjoy warm weather, delicious food and vibrant local culture.",
    "language": "English"
},
{
    "_id": 8,
    "name": "Rio de Janeiro",
    "country": "Brazil",
    "img_name": "images/Rio.jpg",
    "short-desc": "A lively and colorful full of energy, famous for its Carnvial, beaches, and rainforest.",
    "language": "Portuguese"
}
]

app.get("/api/flights/", (req, res)=>{
    console.log("in get request")
    res.send(flights);
});

app.get("/api/flights/:id", (req, res)=>{
    const flight = flights.find((flight)=>flight._id === parseInt(req.params.id));
    res.send(flight);
});


app.listen(3001, () => {
    console.log("Server is up and running");
});