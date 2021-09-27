
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Validator(formSelector) { 
    // Get form  
    let formElement = $(formSelector);
    // Stop when form's not found
    if (!formElement) return;

    // Form rules
    let formRules = {};
    // Validator rules
    let validatorRules = {
        required : function (value, msg = 'Vui lòng nhập trường này') {  
            return value ? undefined : msg;
        },
        email: function (value, msg = 'Email không đúng định dạng') {  
            regexEmail = /^\S+@\S+\.\S+$/
            return value.test(regexEmail) ? undefined : msg;
        },
        min: function (min) {
            return function (value, msg = `Trường này có ít nhất ${min} ký tự`) {
                return value.length >= min ? undefined : msg;
            }
        },
        max: function (max) {
            return function (value, msg = `Trường này có tối đa ${max} ký tự`) {
                return value.length <= max ? undefined : msg;
            }
        }
    }
    // Get all inputs
    let inputs = $$('[name][rules]');
    for (let input of inputs) {
        let rules = input.getAttribute('rules').split('|');
        for (let rule of rules) {
            let isRuleHasValue = rule.includes(':');
            let ruleFunc = validatorRules[rule];
            if (isRuleHasValue)
            {
                let ruleInfo = rule.split(':');
                rule = ruleInfo[0];
                ruleFunc = validatorRules[rule](ruleInfo[1]);
            }

            if (!Array.isArray(formRules[input.name])){
                formRules[input.name] = [ruleFunc];
            }
            else 
                formRules[input.name].push(ruleFunc);
        }
    }
    console.log(formRules);
}