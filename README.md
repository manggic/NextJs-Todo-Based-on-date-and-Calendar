

###  Sign Up <b>(FE)</b> - /signup  

1) It require name,email and password.
2) Providing this data, when user clicks submit button.
3) It goes to handleSignUp function <br>
    - if all three required value is provided
         * disable submit button
         * call fetch API /api/signup with method POST, Content_Type as application/json and body.
         * if response has success true, we will show success msg else we will show error msg  
         * after 2 sec we will redirect to login page (/login)
    - if all required field is not provided we will show a msg saying pls enter all the required details.      



###  Sign Up <b>(BE)</b> - /api/signup

1) collect front-end data from response.json()
2) if name email and password is not provided return success false with appropriate msg
3) checks if email already exist or not, if exist return success false with appropriate msg 
4) generation of calendar with default value, it will be like
```javascript

[{ name:"january", dates:[ { day: 1, tasks:[]  }, {day: 2, tasks:[] }, .... ]  }]

To get current year
const year = new Date().getFullYear()


To get days in month // 2023 is year, 3 is march month 
const daysInMonth = new Date(2023, 3, 0).getDate()

```
5) we will hash our password using bcrypt
6) Save our data into DB with name, email, hashed password and calendar
7) verification of email :
   - generate a token using bcryptjs providing email
   - save token in DB with an expiry date
   - send email using nodemailer to the user with a link and token in query string like <http://localhost:3000/verifyemail?token=12345>
   - when user click this link it will re-direct him to our page.
   - we fetch token from URL and then call fetch API /api/verifyemail/
   - Inside api, we will query DB based on token and expiry,
     if we didn't get user, we return with success false, else we set isVerified as true and token and expiry value to undefined in DB


### Login - /login 

1) Same as Sign up functionality only diff is this require only 2 field email and password and remember me is optional.
   - we call fetch API /api/login
   - Query DB based on email, if user doesn't exist,we return.
   - if exist we compare password with DB password using bcrypt.compare
   - we generate token using jwt providing email to it.
   - we set userToken and expiry in DB based on remember me condition.
   - we set the cookies with an expiry.

2) It has forgot password functionality
    - when user click on forgot password, a modal will open which will ask user to provide email.
    - After clicking submit button, handleSubmit function will check if email is provided or not.
    - After checking it will call fetch API /api/forgotpasswordemail
    - Inside api, we will check for email,
    query DB based on email, if user does not exist will send appropriate msg
    - Then we will check if user is verified or not.
    - we set forgot password token in DB with expiry date
    - we send an email, with link along with token in query string
    - Link will redirect to our page,it will ask user to provide new password and confirm the same.
    - on submit, fetch API /api/forgotpassword is called
    - Inside api, we check if password n confirm password is same.
    - we query DB based on token, if user does not exist we throw msg token is invalid
    - if user is present we hashed provided password, set user db password to hashed password, 
    set forgot password and forgot password token to undefined. 
3) remember me functionality
    - 


































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










