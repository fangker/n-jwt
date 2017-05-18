const {symbol}=require('./util')
const name_space=symbol('header','payload','signature','schema_name','schema','asSchema','mode');
const crypto=require('crypto')
const {header,payload,signature,schema_name,schema,asSchema,mode}=name_space;


class Schema {
    constructor(name, asSchema) {
        this[schema_name] = name;
        this[schema] = this.parseSchema(asSchema)
        return this;
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

        let  signature= crypto.createHash('SHA256', key).update(encodeString).digest('base64');
        let jwt = encodeString + '.' + signature;
        return jwt
    }
    decrypt(alg,encodeString,key){
        let  decodeString= crypto.createHash('SHA256', key).update(encodeString).digest('base64');
        return decodeString;
    }
    parseSchema(schema){
        let header={},payload={};
        schema.type=schema.type||'JWT'
        schema.algorithm=schema.algorithm||'SHA256'
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
    verity(token,key){
        if(!key){
            key=this[schema].key
        }
       let tokenArray;
       tokenArray= token.split('.');
       let decodeString  = Buffer.from(tokenArray[0],'base64').toString('base64')+'.'+ Buffer.from(tokenArray[1],'base64').toString('base64')
      if(this.decrypt('alg',decodeString,key)==Buffer.from(tokenArray[2],'base64').toString('base64')){
           let jwt={
               header:JSON.parse(Buffer.from(tokenArray[0],'base64').toString()),
               payload:JSON.parse(Buffer.from(tokenArray[1],'base64').toString()),
           }
       return jwt
      }else{
          return false
      }
    }
}

module.exports=Schema;