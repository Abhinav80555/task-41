const express = require('express');
require("dotenv").config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8055;

//common call api status
app.get('/', (req, res) => {
  res.send('Welcome to Hall Booking app!')
});

//room
const rooms = [
  {
    name: "Elite",
    seats: 100,
    amenities: "wifi,projection screen,AC",
    price: 1500,
    roomId: "abc",
    bookingDetails: [
      {
        customerName: "rrc",
        date: new Date("2021-11-14"),
        start: "07:00",
        end: "10:00",
        status: "confirmed",
      },
    ],
  },
  {
    name: "Premium",
    seats: 150,
    amenities: "wifi,projection screen,AC",
    price: 2500,
    roomId: "def",
    bookingDetails: [
      {
        customerName: "rrc2",
        date: new Date("2021-11-15"),
        start: "15:00",
        end: "17:00",
        status: "Payment Pending",
      },
    ],
  },
];
//common call api status
app.get("/", (req, res) => {
  res.status(200).send("Server is running successfully ");
});

//create room
app.post("/createroom", (req, res) => {
  rooms.push({
    name: req.body.name,
    seats: req.body.seats,
    amenities: req.body.amenities,
    price: req.body.price,
    roomId: "ghi",
    bookingDetails: [{}],
  });
  res.status(200).send("Room Created");
});

//Book rooms
app.post("/bookroom", (req, res, next) => {
  for (let i = 0; i < rooms.length; i++) {
    if (!(rooms[i].roomId === req.body.roomId)) {
      return res.status(400).send({ error: "Invalid" });
    } else {
      let booking = {
        customerName: req.body.name,
        date: new Date(req.body.date),
        start: req.body.start,
        end: req.body.end,
        status: "confirmed",
      };
      let result = undefined;
      rooms[i].bookingDetails.forEach((book) => {
        if (
          book.date.getTime() == booking.date.getTime() &&
          book.start === booking.start
        ) {
          result = 0;
          console.log("in booking");
          
        } else {
          result = 1;
          rooms[i].bookingDetails.push(booking);
        }
      });
      if (result) return res.status(200).send("Booking confirmed");
      else
        return res
          .status(400)
          .send({ error: "Please select different time slot" });
    }
  }
});

//list customers

app.get("/listcustomer", (req, res) => {
  let customerArray = [];

  rooms.forEach((room) => {
    let customerObj = { roomName: room.name };

    room.bookingDetails.forEach((customer) => {
      customerObj.customerName = customer.customerName;
      customerObj.date = customer.date;
      customerObj.start = customer.start;
      customerObj.end = customer.end;

      customerArray.push(customerObj);
    });
  });

  res.send(customerArray);
});

//get rooms

app.get("/listrooms", (req, res) => {
  res.status(200).send(rooms);
});


app.listen(PORT, () => {
  console.log('server started');
});
