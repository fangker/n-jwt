const {symbol}=require('./util')
const {header,payload,signature}=symbol('header','payload','signature');
const Schema=require('./schema');
let schemaMap=new Map();



module.exports={
    addSchema(name,schema){
        if(schemaMap.has(name)){
            throw Error(`The schama (${name}) already exists`);
        }
        return new Schema(name,schema)
    },
    sign(data,schema){
        return new Schema(false,schema).sign(data)
    },
    verity(token,schema){
        return new Schema(false,schema).verity(token)
    }
}
