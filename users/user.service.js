const secret = process.env.SECRET_KEY,
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    crypto = require("crypto"),
    db = require('_helpers/db'),
    User = db.User,
    mail = require('_helpers/send-email'),
    ObjectId = require('mongodb').ObjectId;

module.exports = {
    create,
    authenticate,
    getUserId,
    addAddress,
    changeDefaultAddress,
    getUserAddresses,
    deleteAddress,
    getAll,
    getById,
    resendVerify,
    verifyEmail,
    forgotPasswordRequest,
    forgotPasswordTokenOnly,
    forgotPasswordUpdate,
    editName
};

//REGISTER
async function create(userParam) {

    if (await User.findOne({ email: userParam.email })) {
        throw 'That email is already in use.';
    }

    const user = new User(userParam);

    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    user.verificationToken = randomTokenString();

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: user.email,
        subject:'verify code',
        text:user.verificationToken
    };

    await mail.send(mailOptions);

    await user.save();
    return {...user.toJSON()};
}

//LOGIN
async function authenticate({ email, password }) {
    const user = await User.findOne({ email });

    if (user && bcrypt.compareSync(password, user.hash)) {

        if (!user.verified) {
            return {verified: user.verified};
        }   

        const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '30d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getUserId(token) {

    let userId = '';
    
    if (token) {
        
        jwt.verify(token, secret, (err, decoded) => {
            if (err){
                console.log(err.message);
                throw 'error';
            } else {
                userId = decoded.sub;
            }
        });
    }

    return userId;
    
}

//ADDRESSES

async function addAddress(token, userParam) {

    let userId = await getUserId(token),
        user = await User.findOne({ _id : ObjectId(userId) }),
        defaultAddress = false,
        street = '',
        streetNumber = Number,
        floor = Number,
        door = '',
        CP = Number;

    if (user) {

        if (user.addresses.length > 0) {

            street = userParam.street;
            streetNumber = userParam.streetNumber;
            floor = userParam.floor;
            door = userParam.door;
            CP = userParam.CP;
    
            user.addresses.push({ street, streetNumber, floor, door, CP });
    
        } else {
    
            defaultAddress = true;
            street = userParam.street;
            streetNumber = userParam.streetNumber;
            floor = userParam.floor;
            door = userParam.door;
            CP = userParam.CP;
    
            user.addresses.push({ defaultAddress, street, streetNumber, floor, door, CP });
    
        }
    
        await user.save();
    
        const address = user.addresses[user.addresses.length - 1];
    
        return address;
        
    } else {

        throw 'User not found.';

    }

}

async function changeDefaultAddress(token, id) {

    let userId = await getUserId(token);

    await User.updateOne({ _id : userId, 'addresses.defaultAddress': 'true'}, { '$set': {
        'addresses.$.defaultAddress': 'false'
    }});

    await User.updateOne({ 'addresses._id' : id  }, { '$set' : {
        'addresses.$.defaultAddress': 'true',
    }});

    const user = await User.find({ _id : userId });

    return user;
}

async function getUserAddresses(token) {

    let userId = await getUserId(token);

    const addresses = await User.find({ _id : ObjectId(userId) }, ['addresses', '-_id']);

    if (addresses) {

        return addresses;

    }

}

async function deleteAddress(token, id) {

    let userId = await getUserId(token);

    const user = await User.findOne({ _id : userId });

    user.addresses.pull(id);

    await user.save();

    return user.addresses;

}

//GET ALL / GET BY ID

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(ObjectId(id));
}

//GENERATE TOKENS (not authentication tokens, verify email and forgot pw tokens)
function randomTokenString() {
    return crypto.randomBytes(2).toString('hex');
}

//VERIFY EMAIL, RESEND VERIFY

async function resendVerify({ emailParam }) {
    const user = await db.User.findOne({ email : emailParam });

    if (!user) throw 'User not found.';
    if(user.verified) throw 'User is already validated.';

    user.verificationToken = randomTokenString();

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: user.email,
        subject:'verify code',
        text:user.verificationToken
    };

    await mail.send(mailOptions);

    await user.save();
}

async function verifyEmail({ token }) {
    const user = await db.User.findOne({ verificationToken: token }, ['-favorites', '-addresses']);

    if (!user) throw 'User not found/invalid verify token.';

    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    const newToken = jwt.sign({ sub: user.id }, secret, { expiresIn: '30d' });
        return {
            ...user.toJSON(),
            newToken
        };
    
}

//FORGOT PW

async function forgotPasswordRequest({ email }) {
    const user = await db.User.findOne({email : email});
    if(!user) throw 'User not found.';

    user.forgotPwToken = randomTokenString();
    
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: user.email,
        subject:'forgot password token',
        text:user.forgotPwToken
    };

    await mail.send(mailOptions);

    await user.save();
}

async function forgotPasswordTokenOnly(userParam) {
    const user = await db.User.findOne({ forgotPwToken: userParam.token });
    if (!user) throw 'User not found/invalid reset pw token.';
    
    return;
}

async function forgotPasswordUpdate(userParam) {
    const user = await db.User.findOne({ forgotPwToken: userParam.token });

    if (!user) throw 'User not found/invalid reset pw token.';

    if(userParam.pw != userParam.confirmPw) throw 'Passwords must match.'

    if (userParam.pw) {
        user.hash = bcrypt.hashSync(userParam.pw, 10);
    }
    user.forgotPwToken = undefined;

    await user.save();

    return {user : user};
}

async function editName(token, userParam) {

    let userId = await getUserId(token);

    const user = await User.findOne({_id : userId});

    if (!user) throw 'User not found.';

    user.firstName = userParam.firstName;
    user.lastName = userParam.lastName;

    await user.save();

    return user;
}