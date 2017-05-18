let Jwt=require('./bin/n-jwt')
let schema={
    algorithm:'HS256',
    key:function (jwtid) {

    },
    expiresIn:'6000',
    notBefore:'6000',
    audience:'ssf',
    issuer:'fdsf',
    jwtid:'',
    createdat:'6556545454',
    admin:'true'
}
let adminSchema=Jwt.addSchema('admin',schema);
let a=adminSchema.load({jwtid:'6666'})
console.log(a)

