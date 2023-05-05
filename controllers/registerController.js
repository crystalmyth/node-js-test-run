// const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

// const userDataPath = path.join(__dirname, "..", "model", "users.json");
// const userDB = {
//     users: require(userDataPath),
//     setUsers: function (data) { 
//         this.users = data;
//     }
// };
const User = require(path.join(__dirname,"..","model","User"));

const handleNewUser = async (req, res) => { 
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({
        "message": "Username and Password required!"
    });
    //check for duplicate username in the db
    // const duplicate = userDB.users.find(person => person.username === user);
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd,
        });
        console.log(result);
        // const newUser = {
        //     "username": user,
        //     "roles": {
        //         "User": 2001
        //     },
        //     "password": hashedPwd,
        // };
        // userDB.setUsers([...userDB.users, newUser]);
        // await fsPromises.writeFile(
        //     userDataPath,
        //     JSON.stringify(userDB.users)
        // );
        // console.log(userDB.users);

        res.status(201).json({
            "success": `New user ${user} created!!`,
        });

     } catch (err) { 
        res.status(500).json({
            "message": err.message,
        });
    }

}

module.exports = {handleNewUser};