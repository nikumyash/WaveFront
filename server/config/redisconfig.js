const Redis = require("ioredis")

const redis = new Redis(6379);
redis.on('connect',()=>{
    console.log("redis connected");
})

module.exports =  redis;