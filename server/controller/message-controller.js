import Message from "../model/Message.js";
import Conversation from '../model/Conversation.js';


import CryptoJS from 'crypto-js';


const decryptionKey = 'testeCrypto123';

const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(JSON.stringify(message), decryptionKey ).toString();
};

// const decryptMessage = (encryptedMessage) => {
//     const bytes = CryptoJS.AES.decrypt(encryptedMessage.text, decryptionKey);
//     encryptedMessage.text = bytes.toString(CryptoJS.enc.Utf8);
// };

export const newMessage = async (request, response) => {
    console.log(request.body);    
    try {
        const newMessage = new Message(request.body);
        await newMessage.save();
        // decryptMessage(request.body);
        await Conversation.findByIdAndUpdate(request.body.conversationId, { message: request.body.text });
        response.status(200).json("Message has been sent successfully");
    } catch (error) {
        response.status(500).json(error);
    }

}

export const getMessage = async (request, response) => {
    try {
        const messages = await Message.find({ conversationId: request.params.id });
        // const encryptedMessage = encryptMessage(messages);
        // console.log(messages
        response.status(200).json(messages);
    } catch (error) {
        response.status(500).json(error);
    }

}