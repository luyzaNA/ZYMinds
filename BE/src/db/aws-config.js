import AWS from 'aws-sdk';
AWS.config.update({
    accessKeyId: 'AKIA6GBMB22IMHJ5T5HV',
    secretAccessKey:  process.env.AWS_SECRET
});

export default AWS;