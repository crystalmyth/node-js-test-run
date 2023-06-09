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
const jwt = require('jsonwebtoken');
// const fsPromises = require('fs').promises;

const handleLogin = async (req, res) => { 
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({
        "message": "Username and Password required!"
    });
    // const foundUser = userDB.users.find(person => person.username === user);
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorised

    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current User
        // const otherUsers = userDB.users.filter(person => person.username !== foundUser.username);
        // const currentUser = { ...foundUser, refreshToken };
        // userDB.setUsers([...otherUsers, currentUser]);
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        // await fsPromises.writeFile(
        //     path.join(__dirname, "..", "model", "users.json"),
        //     JSON.stringify(userDB.users),
        // );
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'None', 
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({
            accessToken
        });
    } else { 
        res.sendStatus(401); 
    }
}

module.exports = { handleLogin };