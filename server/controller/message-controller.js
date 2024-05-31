const { encrypt, decrypt } = require('../utils/crypto');
const Message = require('../model/Message');

exports.sendMessage = async (req, res) => {
  try {
    const encryptedMessage = encrypt(req.body.message);
    const newMessage = new Message({ ...req.body, message: encryptedMessage });
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getMessage = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId });
    const decryptedMessages = messages.map((msg) => ({
      ...msg._doc,
      message: decrypt(msg.message),
    }));
    res.status(200).json(decryptedMessages);
  } catch (err) {
    res.status(500).json(err);
  }
};