import { createClient } from 'redis';

const redisClient = createClient({
  host: 'localhost', 
  port: 6379,       
  password: '123456' 
});

redisClient.on('error', (err) => console.log('❌ Redis Client Error', err));

await redisClient.connect();
console.log('✅ Redis 连接成功');

export default redisClient;