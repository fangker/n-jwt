let Jwt=require('./bin/n-jwt')
let a=Jwt.sign({name:'zhangsan'},{key:'dsdsdsdsds'})
console.log(a)