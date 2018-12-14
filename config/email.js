module.exports = {
    transport: {
        host: 'smtp.postmarkapp.com',
        port: 587,
        secure: false,
        auth: {
            user: '',
            pass: ''
        },
        tls: {
            ciphers: 'SSLv3'
        }
    },
    options: {
        from: '',
        to: ''
    }
}