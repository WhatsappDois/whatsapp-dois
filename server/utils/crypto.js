import crypto from 'crypto';

// Função para gerar uma chave AES
const generateAESKey = () => {
    return crypto.randomBytes(32); // 256 bits
};

// Função para criptografar uma mensagem
const encryptMessage = (message, key) => {
    const iv = crypto.randomBytes(16); // Initialization Vector
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
};

// Função para descriptografar uma mensagem
const decryptMessage = (encryptedData, iv, key) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

export { generateAESKey, encryptMessage, decryptMessage };
