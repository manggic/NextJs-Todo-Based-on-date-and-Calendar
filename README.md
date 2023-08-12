bugs

1. get_json_data getting called twice

### User Schema

```javascript
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
});

const dateSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  tasks: [taskSchema],
});

const monthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dates: [dateSchema],
});

const yearSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  months: [monthSchema],
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  calendar: [yearSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
```

### Final data(user) in DB will be like

```javascript
{
  name: "rajeev",
  email: "rajeev@gmail.com",
  password: "someString",
  calendar: [
    {
      year: "2023",
      months: [
        {
          name: "january",
          dates: [
            {
              day: 1,
              tasks: [
                {
                  name: "",
                  status: "",
                },
              ],
            },
            // Other dates in January...
          ],
        },
        // Other months in 2023...
      ],
    },
    // Other years...
  ],
}

```

### CRUD operations

```javascript
const user = await User.findById(userId);
const yearIndex = user.calendar.findIndex((year) => year.year === "2023");
const monthIndex = user.calendar[yearIndex].months.findIndex(
  (month) => month.name === "January"
);
const dateIndex = user.calendar[yearIndex].months[monthIndex].dates.findIndex(
  (date) => date.day === 1
);

const taskIndex = user.calendar[yearIndex].months[monthIndex].dates[
  dateIndex
].tasks.findIndex((task) => task.name === "breakfast");

if (taskIndex !== -1) {
  user.calendar[yearIndex].months[monthIndex].dates[dateIndex].tasks[
    taskIndex
  ].status = 1;
  await user.save();
}
```



### sign up code for adding default data
```javascript
const express = require('express');
const router = express.Router();
const User = require('./models/user'); // Your User model

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create the user account
    const newUser = await User.create({ name, email, password });

    // Generate default calendar data
    const defaultCalendarData = generateDefaultCalendarData();

    // Update the user with the default calendar data
    await User.findByIdAndUpdate(newUser._id, { calendar: defaultCalendarData });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Function to generate default calendar data for all months
function generateDefaultCalendarData() {
  const calendarData = [];

  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  const currentYear = new Date().getFullYear();

  for (const month of months) {
    const daysInMonth = new Date(currentYear, months.indexOf(month) + 1, 0).getDate();
    const monthData = {
      name: month,
      dates: Array.from({ length: daysInMonth }, (_, index) => ({ day: index + 1, tasks: [] }))
    };
    calendarData.push(monthData);
  }

  return [{ year: currentYear.toString(), months: calendarData }];
}

module.exports = router;

```



### update a task 
```javascript
const userEmail = "rajeev@gmail.com";
const targetDate = new Date("2023-02-14"); // Specify the target date

// Find the user document by email
const user = db.users.findOne({ email: userEmail });

if (user) {
  // Find the index of the target date within the "dates" array
  const targetDateIndex = user.calendar.months.dates.findIndex(date => date.day === targetDate.getDate());

  if (targetDateIndex !== -1) {
    // Update the task for the specified date
    user.calendar.months.dates[targetDateIndex].tasks.push({
      name: "New Task",
      status: "pending"
    });

    // Update the user document with the modified calendar data
    db.users.updateOne({ email: userEmail }, { $set: { calendar: user.calendar } });

    print("Task added successfully!");
  } else {
    print("Target date not found.");
  }
} else {
  print("User not found.");
}

```

### update a task using shell

```javascript
const userEmail = "rajeev@gmail.com";
const targetDate = new Date("2023-02-14"); // Specify the target date

// Update the task for the specified date
db.users.findOneAndUpdate(
  { email: userEmail, "calendar.months.dates.day": targetDate.getDate() },
  {
    $push: {
      "calendar.months.$[month].dates.$[date].tasks": {
        name: "New Task",
        status: "pending"
      }
    }
  },
  {
    arrayFilters: [
      { "month.name": "january" }, // Specify the target month
      { "date.day": targetDate.getDate() }
    ],
    new: true
  }
);

```