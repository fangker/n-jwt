module.exports={
    symbol:function symbol(...description) {
        let _symbol={};
        for(let i of description){
            _symbol[i]=Symbol(i)
        }
        return _symbol
    }
}
