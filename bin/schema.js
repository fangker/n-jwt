const {symbol,validator}=require('./util')
const name_space=symbol('header','payload','signature','schema_name','schema','asSchema');
const crypto=require('crypto')
const {header,payload,signature,schema_name,schema,asSchema}=name_space;

const schemaValidator={

}
class Schema {
    constructor(name, asSchema) {
        this[schema_name] = name;
        this[schema] = this.parseSchema(asSchema)
        this[asSchema] =asSchema
        return validator(asSchema, schemaValidator)
    }
    get name() {
        return this[schema_name]
    }
    get schema() {
        return this[schema]
    }
    sign(data,reschema) {
        if(!reschema)
           reschema=this[schema]
      let  {alg,encodeString}= this.bindData(reschema,data)
      let jwt  =   this.encrypt(alg,encodeString,this[schema].key)
       return jwt;
    }

    bindData({header,payload}, data) {
        payload = Object.assign(data, payload);
        let encodeString = Buffer.from(JSON.stringify(header)).toString('base64') + '.' + Buffer.from(JSON.stringify(payload)).toString('base64');
        return {alg:header.alg, encodeString:encodeString}
    }
    encrypt(alg,encodeString,key){

        let  signature= crypto.createHmac('SHA256', key).update(encodeString).digest('base64');
        let jwt = encodeString + '.' + signature;
        return jwt
    }
    parseSchema(schema){
        let header={},payload={};
        schema.type=schema.type||'JWT'
        schema.algorithm=schema.algorithm||'RSA-SHA256'
        for (let key in schema) {
            let val=schema[key]
            if (val === false) {
                continue
            }
            switch (key) {
                case 'algorithm':
                    header['alg'] = val
                    break;
                case 'type':
                    header['typ'] = val
                    break;
                case 'expiresIn':
                    payload['exp'] = Date.now() + parseInt(val)
                    break;
                case 'createdat':
                    payload['iat'] = val || Date.now()
                    break;
                case 'notBefore':
                    payload['nbf'] = Date.now()
                    break;
                case 'jwtid':
                    payload['jti'] = val
                    break;
                case 'audience':
                    payload['aud'] = val
                    break;
                case 'issuer':
                    payload['iss'] = val
                    break;
                default:
                    break
            }
        }
        return {header:header,payload:payload,key:schema.key}
    }
    load(schama){
        if(schema.secret&&schema.secret!=asSchema.secret){
            throw Error('secret cannot be reset ')
        }
        if(schema.algorithm&&schema.algorithm!=asSchema.algorithm){
            throw Error('algorithm  cannot be reset ')
        }
        let _schema = Object.assign(this[asSchema],this[asSchema]);
        this[asSchema]=_schema;
        let schema=this.parseSchema(this[_schema]);
        let self=this
        let sign=function (data) {
            self.sign( data,schema);
        }
        return {sign:sign}
    }
    verity(token){
       let tokenArray;
       tokenArray= token.split('.');

    }
}

module.exports=Schema;