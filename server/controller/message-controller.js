import Message from "../model/Message.js";
import Conversation from '../model/Conversation.js';
import CryptoJS from 'crypto-js';

const decryptionKey = 'testeCrypto123';

const decryptMessage = (encryptedMessage) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, decryptionKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const newMessage = async (request, response) => {
    const decryptedMsg = decryptMessage(request.body); 

    const newMessage = new Message(decryptedMsg);

    try {
        await newMessage.save();
        await Conversation.findByIdAndUpdate(decryptedMsg.conversationId, { message: decryptedMsg.text });
        response.status(200).json("Message has been sent successfully");
    } catch (error) {
        response.status(500).json(error);
    }

}

export const getMessage = async (request, response) => {
    try {
        const messages = await Message.find({ conversationId: request.params.id });
        response.status(200).json(messages);
    } catch (error) {
        response.status(500).json(error);
    }

}