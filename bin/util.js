module.exports={
    symbol:function symbol(...description) {
        let _symbol={};
        for(let i of description){
            _symbol[i]=Symbol(i)
        }
        return _symbol
    },
    validator:function (target,validator) {
        let e;
        try{
            proxy()
        }catch (e) {
            e=e;
        }finally {
            return e||true
        }
        function proxy() {
            return     new Proxy(target,{
                _validator: validator,
                set(target, key, value, proxy) {
                    if (target.hasOwnProperty(key)) {
                        let validator = this._validator[key];
                        let{type,devalue}=validator(value);
                        if ((typeof value===type)==false) {
                            return Reflect.set(target, key, value, proxy);
                        }else if((typeof value===type)==false&&devalue!=undefined) {
                            return Reflect.set(target, key, devalue, proxy);
                        }else {
                            throw Error(`Cannot set ${key} to ${value}. Invalid.`);
                        }
                    } else {
                        throw Error(`${key} is not a valid property`)
                    }
                }
            })
        }
    }
}
