const {symbol,validator}=require('./util')
const name_space=symbol('header','payload','signature','schema_name','schema','asSchema');
const crypto=require('crypto')
const {header,payload,signature,schema_name,schema,asSchema}=name_space;

const schemaValidator={
    [schema_name](val){
      return {type:'string',devalue:'default'}
    },
    [schema](){
       return{type:'object'}
    }
}
class Schema {
    constructor(name, asSchema) {
        this[schema_name] = name;
        this[schema] = this.parseSchema(asSchema)
        this[asSchema] =asSchema
        return validator(this, schemaValidator)
    }
    get name() {
        return this[schema_name]
    }
    get schema() {
        return this[schema]
    }
    sign(schema=this[schema],data) {
      let  {alg,encodeString}= this.bindData(schema,data)
      let jwt  =   this.encrypt(alg,encodeString,this[schema].key)
        console.log(jwt);
    }

    bindData({header,payload}, data) {
        payload = Object.assign(data, payload);
        let encodeString = Buffer.form(header).toString('base64') + '.' + Buffer().form(payload).toString('base64');
        return {alg:header.alg, encodeString:encodeString}
    }
    encrypt(alg,encodeString,...key){
        let key,pubKey,priKey
        let signature
        let sign = crypto.createSign('RSA-SHA256');
        sign.update(encodeString);
        signature = sign.sign(key, 'hex');
        return jwt = encodeString + '.' + signature;
    }
    parseSchema(schema){
        let header,payload;
        for (let {key, val}of schema) {
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
        let _schema = Object.assign(this[asSchema],this[asSchema]);
        this[asSchema]=_schema;
        let schema=this.parseSchema(this[_schema]);
        return function (data) {
            this.sign(schema,data);
        }
    }
}

module.exports=Schema;