const path = require('path');
// const fsPromises = require('fs').promises;

// const userDataPath = path.join(__dirname, "..", "model", "users.json");
// const userDB = {
//     users: require(userDataPath),
//     setUsers: function (data) { 
//         this.users = data;
//     }
// };
const User = require(path.join(__dirname, "..", "model", "User"));

const handleLogout = async (req, res) => { 
    //On client, also delete the accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in DB?
    // const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();

    if (!foundUser) { 
        res.clearCookie('jwt', {
            httpOnly: true,
            // secure: true,
            sameSite: 'None'
        });
        return res.sendStatus(204);
    }

    //Delete the refreshToken in DB
    // const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);

    // const currentUser = { ...foundUser, refreshToken: '' };
    // userDB.setUsers([...otherUsers, currentUser]);
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);
    // await fsPromises.writeFile(
    //     userDataPath,
    //     JSON.stringify(userDB.users),
    // );
    res.clearCookie('jwt', {
        httpOnly: true,
        // secure: true,
        sameSite: 'None'
    }); //secure: true only servers on https
    res.sendStatus(204);
}

module.exports = { handleLogout };