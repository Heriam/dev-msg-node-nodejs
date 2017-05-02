/**
 * Created by hjiang on 25/04/2017.
 */
let Operators = require('../Operators');

class Obligator {
    constructor(context){
        this.name = 'PEP';
        this.context = context;
        this.logger = context.registry.getLogger();
        this.develop = context.devMode;
        this.operators = new Operators();
    }

    obligate(response){
        response.obligations.forEach((params, key)=>{
            let msg = response.getMessage();
            let attri = Object.keys(params)[0];
            let value = this.context.getValueOfAttribute(attri, msg);
            switch (key) {
                case 'limitByNumberOfEntries':
                    let number= params[attri];
                    value = value.slice(0, number);
                    response.setMessage(this.context.setValueOfAttribute(attri, msg, value));
                    break;
                case 'limitByConditionOfEntries':
                    let attributeCondition = params[attri];
                    let attrKey = Object.keys(attributeCondition)[0];
                    let operator = Object.keys(attributeCondition[attrKey])[0];
                    let params = attributeCondition[attrKey][operator];
                    for(let i in value) {
                        let entry = value[i];
                        let attrVal = entry[attrKey];
                        if(!this.operators[operator](attrVal, params, attrKey)){
                            delete value[i];
                        }
                    }
                    response.setMessage(this.context.setValueOfAttribute(attri, msg, value));
                    break;
                default:
                    break;
            }
        });
        return response;
    }
}
module.exports = Obligator;