import AWS from 'aws-sdk';
AWS.config.update({
    accessKeyId: 'AKIA6GBMB22IL5EK7DIH',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default AWS;

