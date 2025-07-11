const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const cors = require('cors');
const cron = require('node-cron');
const Registration = require("./config/registeration");
const EventPass = require("./config/eventpass");
const gupshup = require('@api/gupshup')
const Student=require('./config/student');
app.use(cors(
    {
        origin: ["https://event-pass-git-main-hkmvizags-projects.vercel.app","https://event-pass-git-main-hkmvizags-projects.vercel.app","https://event-pass-blue.vercel.app","http://localhost:3000",
          "https://event-pass-git-main-sivabalajieevana-12s-projects.vercel.app","https://event-pass-sivabalajieevana-12s-projects.vercel.app","https://event-pass-chi.vercel.app","https://admin-panel-iota-nine.vercel.app","https://heritage-form-gxoz.vercel.app"
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));
app.use(express.json());
db();
app.get('/events',(req,res)=>{
    const EventPass = require('./config/eventpass');
    EventPass.find()
        .then(events => res.status(200).json(events))
        .catch(err => res.status(500).json({ error: err.message }));
}
)
app.get('/users',(req,res)=>{
    const Registration = require('./config/registeration');
    Registration.find()
        .populate('user')
        .populate('event')
        .then(registrations => res.status(200).json(registrations))
        .catch(err => res.status(500).json({ error: err.message }));
})
// const EventPass = require('./config/eventpass'); // Adjust path if needed

app.delete('/events/:id', async (req, res) => {
  const eventId = req.params.id;

  try {
    const deletedEvent = await EventPass.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully', deletedEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//     res.status(200).send("Hi Siva cd Balaji Naidu Eevana")
// })
// app.post('/api/event',(req,res)=>{
//     const { title, description, date, location, capacity } = req.body;
//     if (!title || !date) {
//         return res.status(400).json({ error: 'Title and date are required' });
//     }
//     const EventPass = require('./config/eventpass');
//     const newEvent = new EventPass({ title, description, date, location, capacity });
//     newEvent.save()
//         .then(event => res.status(201).json(event))
//         .catch(err => res.status(500).json({ error: err.message }));
// })
const { DateTime } = require('luxon');

app.post('/api/event', (req, res) => {
  const { title, description, date, location, capacity } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required' });
  }

  let eventDateUTC;
  try {
    // Convert local datetime string (from browser) as IST → UTC
    eventDateUTC = DateTime.fromISO(date, { zone: 'Asia/Kolkata' }).toUTC().toJSDate();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  const EventPass = require('./config/eventpass');
  const newEvent = new EventPass({
    title,
    description,
    date: eventDateUTC,
    location,
    capacity,
  });

  newEvent.save()
    .then(event => res.status(201).json(event))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.post('/api/user', async (req, res) => {
    const { eventId } = req.query;
    if (!eventId) {
        return res.status(400).json({ error: 'Event ID is required' });
    }

    const { name, email, phone, location } = req.body;
    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone are required' });
    }

    try {
        const phonealpha = "91" + phone;

        const eventsa = await EventPass.findById(eventId);
        if (!eventsa) return res.status(404).json({ error: "Event not found" });

        const Student = require('./config/student');
        const newStudent = new Student({ name, email, phone: phonealpha, location });
        const savedStudent = await newStudent.save();

        const Registration = require('./config/registeration');
        const newRegistration = new Registration({ user: savedStudent._id, event: eventId });
        const savedRegistration = await newRegistration.save();

        const messageResponse = await gupshup.sendingTextTemplate({
            template: {
                id: '6cc5bf4e-8914-4d40-bb5f-e3d46d2d66c8',
                params: [name, eventsa.title]
            },
            'src.name': 'Production',
            destination: phonealpha,
            source: '917075176108',
        }, {
            apikey: 'zbut4tsg1ouor2jks4umy1d92salxm38'
        }).then((data)=>{
          console.log(data)
        })
        .catch((err)=>{
          console.error(err)
        });

        console.log("WhatsApp message sent successfully:", messageResponse);

        res.status(201).json(savedRegistration);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/event/:id', async (req, res) => {
    const { id } = req.params;
    const Registration = require('./config/registeration');
    try {
        const registeredUsers = await Registration.find({ event: id }).populate('user');
        console.log("Registered Users", registeredUsers);
        return res.send({ registeredUsers });
    } catch (err) {
        console.error("Error fetching registered users:", err);
        return res.status(500).json({ error: err.message });
    }
});
// app.get('/simha',async (req,res)=>{
//       const Student = require('./config/student');
//       try{
//   const stud=await Registration.deleteMany({});
//   const events1=await Student.deleteMany({});
//   const deleted= await EventPass.deleteMany({});
//   console.log(stud,events1,deleted);
//   return res.status(201);
//       }
//       catch(err){
//         console.log("error",err)
//       }
// })
// const cron = require('node-cron');

cron.schedule("* * * * *", async () => {
  console.log("Running notification scheduler...");

  try {
    const currentDate = new Date();
    const events = await EventPass.find();
    console.log("Events fetched:", events.length);

    for (const event of events) {
      const eventTime = new Date(event.date);

      // Skip past events
      if (eventTime <= currentDate) continue;

      const diffInMs = eventTime - currentDate;
      const diffInMinutes = diffInMs / (1000 * 60);
      console.log('Current Time:', currentDate);
      console.log('Event Time:', eventTime);
      console.log('Diff in Minutes:', diffInMinutes);

      // Trigger notifications if within 2-minute window of 24h, 3h, or 1h before the event
      if (
        Math.abs(diffInMinutes - 1440) <= 2 || // 24 hours
        Math.abs(diffInMinutes - 180) <= 2 ||  // 3 hours
        Math.abs(diffInMinutes - 60) <= 2      // 1 hour
      ) {
        const registrations = await Registration.find({ event: event._id }).populate("user");
        console.log(`Sending notifications for event: ${event.title}, to ${registrations.length} users`);
        const eventDateIST = DateTime.fromJSDate(new Date(event.date)).setZone('Asia/Kolkata');
        for (const reg of registrations) {
          const user = reg.user;

          try {
            const response = await gupshup.sendingTextTemplate({
              template: {
                id: '60920254-36ad-426f-9c98-e0bc32b54706',
                //60920254-36ad-426f-9c98-e0bc32b54706
                params: [
                  user.name,
                  event.title,
                      eventDateIST.toFormat("dd-MM-yyyy"),  // or 'D' for long format
      eventDateIST.toFormat("hh:mm a"),  
                  event.location
                ]
              },
              'src.name': 'Production',
              destination: user.phone,  // Ensure this is in E.164 format
              source: '917075176108',
            }, {
              apikey: 'zbut4tsg1ouor2jks4umy1d92salxm38'
            });

            console.log(`Notification sent to ${user.name} (${user.phone}):`, response);
          } catch (err) {
            console.error(`Error sending message to ${user.name} (${user.phone}):`, err);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in notification scheduler:", error);
  }
});
app.get('/event-registrations', async (req, res) => {
  try {
    const result = await Registration.aggregate([
      {
        $lookup: {
          from: 'eventpasses', // Collection name from EventPass model
          localField: 'event',
          foreignField: '_id',
          as: 'eventDetails'
        }
      },
      { $unwind: '$eventDetails' },
      {
        $lookup: {
          from: 'students', // Collection name from Student model
          localField: 'user',
          foreignField: '_id',
          as: 'studentDetails'
        }
      },
      { $unwind: '$studentDetails' },
      {
        $group: {
          _id: '$eventDetails._id',
          eventTitle: { $first: '$eventDetails.title' },
          students: {
            $push: {
              name: '$studentDetails.name',
              email: '$studentDetails.email',
              phone: '$studentDetails.phone',
              location: '$studentDetails.location'
            }
          }
        }
      }
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const mongoose=require('mongoose');
app.get('/event-registrations/:eventId', async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const result = await Registration.aggregate([
      {
        $match: {
          event: new mongoose.Types.ObjectId(eventId)
        }
      },
      {
        $lookup: {
          from: 'eventpasses',
          localField: 'event',
          foreignField: '_id',
          as: 'eventDetails'
        }
      },
      { $unwind: '$eventDetails' },
      {
        $lookup: {
          from: 'students',
          localField: 'user',
          foreignField: '_id',
          as: 'studentDetails'
        }
      },
      { $unwind: '$studentDetails' },
      {
        $group: {
          _id: '$eventDetails._id',
          eventTitle: { $first: '$eventDetails.title' },
          students: {
            $push: {
              name: '$studentDetails.name',
              email: '$studentDetails.email',
              phone: '$studentDetails.phone',
              location: '$studentDetails.location'
            }
          }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No registrations found for this event' });
    }

    res.status(200).json(result[0]); // send just the single event group
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3300,()=>{
    console.log("Server is running on port 3300");
})