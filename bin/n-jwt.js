const {symbol}=require('./util')
const {header,payload,signature}=symbol('header','payload','signature');
const Schema=require('./schema');
let schemaMap=new Map();



module.exports={
    addSchema(name,schema){
        if(schemaMap.has(name)){
            throw Error(`The schama (${name}) already exists`);
        }
        let aschema=new Schema(name,schema)
        schemaMap.set(name,aschema)
        return aschema
    },
    sign(data,schema){
        return new Schema(false,schema).sign(data,undefined)
    },
    verity(token,schema){
        return new Schema(false,schema).verity(token)
    },
    getSchema(name){
        if(!schemaMap.get(name)) {
            throw Error(`The schama(${name}) not find`);
        }
    }
}
