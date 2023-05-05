const path = require('path');

// const userDataPath = path.join(__dirname, "..", "model", "users.json");
// const userDB = {
//     users: require(userDataPath),
//     setUsers: function (data) { 
//         this.users = data;
//     }
// };
const User = require(path.join(__dirname,"..","model","User"));
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => { 
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401)//Unauthorised;
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    // const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden

    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                { 
                    UserInfo: {
                        username: decoded.username,
                        roles: roles
                    }
                 },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' },
            );

            res.json({accessToken});
         }
    );
}

module.exports = { handleRefreshToken };