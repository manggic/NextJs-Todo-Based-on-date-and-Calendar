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
db.users.findOneAndUpdate(
  {
    email: "m@m.com"
  },
  {
    $push: {
      "calendar.$[year].months.$[month].dates.$[date].tasks": {
        name: "New Task",
        status: "pending"
      }
    }
  },
  {
    arrayFilters: [
      { "year.year": "2023" },
      { "month.name": "february" },
      { "date.day": 14 }
    ],
    new: true
  }
);

```


## edit a todo code 

```javascript
import { NextRequest, NextResponse } from "@next/server"; // Make sure this is the correct import path
import User from '@/models/UserModel';

export async function PUT(request: NextRequest) {
  try {
    const { year, month, day, taskName, updatedTask, email } = await request.json();

    const user = await User.findOne({ email });

    if (user) {
      const updatedUser = await User.findOneAndUpdate(
        {
          email
        },
        {
          $set: {
            'calendar.$[year].months.$[month].dates.$[date].tasks.$[task].name': updatedTask.name,
            'calendar.$[year].months.$[month].dates.$[date].tasks.$[task].status': updatedTask.status
          }
        },
        {
          arrayFilters: [
            { 'year.year': year },
            { 'month.name': month },
            { 'date.day': day },
            { 'task.name': taskName }
          ],
          new: true
        }
      );

      return NextResponse.json({
        success: true,
        msg: "Todo updated successfully",
        data: updatedUser
      });
    } else {
      return NextResponse.json({ success: false, msg: "User not found" });
    }
  } catch (error) {
    console.error('ERROR', error);
    return NextResponse.json({ success: false });
  }
}

```










### Database Backup:
Export your local MongoDB data to a backup file.
Use the mongodump command to create a backup of your MongoDB database:

```
mongodump --db <database_name> --out <backup_directory>

The files you received after running the mongodump command are part of the backup created for your MongoDB database. Let me explain what each of these files represents:


users.bson: This is a BSON file that contains the actual data of your MongoDB collection(s). BSON is a binary format used by MongoDB to store and exchange data. This file contains the documents (data records) from your "users" collection.

users.metadata.json: This is a JSON file that contains metadata about the collection. It includes information such as indexes, options, and other metadata related to the "users" collection. This file is used by mongorestore to properly recreate the collection and its indexes.
```

### Database Restoration:
When you perform a database restore using mongorestore, both of these files will be used to recreate the "users" collection with its data and metadata.

To restore your database, you can use the mongorestore command and point it to the directory where the backup files are located. Here's how you might do it:

```
mongorestore --db <database_name> <path_to_backup_directory>


This will restore the "users" collection with its data and metadata to your MongoDB database.

Remember to have your MongoDB server running and properly configured before running the mongorestore command.
```

### bson file

The .bson file format is a binary format used by MongoDB to store data. You won't be able to directly open a .bson file like a text-based JSON file. To view the contents of a .bson file, you typically use tools provided by MongoDB.


```
bsondump /path/to/users.bson

This command will output the contents of the .bson file in a human-readable format, allowing you to see the data stored in the file.
```

* todo

2) addtodo pop-up position is not proper






