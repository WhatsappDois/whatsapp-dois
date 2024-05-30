import mongoose from 'mongoose';

const Connection = async (username, password) => {
    const URL = `mongodb+srv://${username}:${password}@wpp2.it7kchc.mongodb.net/`;

    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('Database Connected Successfully');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

export default Connection;