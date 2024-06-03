import Message from "../model/Message.js";
import Conversation from '../model/Conversation.js';

const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(JSON.stringify(message), encryptionKey).toString();
};


export const newMessage = async (request, response) => {
    const newMessage = new Message(request.body);
    try {
        await newMessage.save();
        await Conversation.findByIdAndUpdate(request.body.conversationId, { message: request.body.text });
        response.status(200).json("Message has been sent successfully");
    } catch (error) {
        response.status(500).json(error);
    }

}

export const getMessage = async (request, response) => {
    try {
        const messages = await Message.find({ conversationId: request.params.id });
        const encryptedMessage = encryptMessage(messages);
        response.status(200).send(encryptedMessage);
    } catch (error) {
        response.status(500).json(error);
    }

}
