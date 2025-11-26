console.log('Starting test...');
try {
    const { PrismaClient } = require('@prisma/client');
    console.log('Imported PrismaClient');
    const prisma = new PrismaClient();
    console.log('Initialized PrismaClient');
    prisma.$connect().then(() => {
        console.log('Connected to DB');
        prisma.$disconnect();
    }).catch(e => {
        console.error('Connection failed:', e);
    });
} catch (e) {
    console.error('Error:', e);
}
