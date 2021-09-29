
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Validator(formSelector) { 
    let _this = this;
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
            return regexEmail.test(value) ? undefined : msg;
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
            else {
                formRules[input.name].push(ruleFunc);
            }
        }
        // Event
        input.onblur = handleValidate;
        input.oninput = handleValidate;
    }
    function handleValidate(e) {  
        let rules = formRules[e.target.name];
        let formGroup = e.target.closest('.form-group');
        let formMessage = formGroup.querySelector('.form-message');
        let errorMessage;
        rules.forEach(rule => {
            errorMessage = rule(e.target.value);
            return;
        });
        
        if (errorMessage) {
            if (!formGroup || !formMessage) return;
            formGroup.classList.add('invalid');
            formMessage.innerText = errorMessage;
        }  
        else {
            formGroup.classList.remove('invalid');
            formMessage.innerText = '';
        }
        // Return true if errorMessage is undefined
        return !errorMessage;
    }
    // Submit behavior
    formElement.onsubmit = function (e) {  
        e.preventDefault();
        let isValid = true;
        inputs.forEach(input => {
            isValid = !handleValidate({target: input}) ? false : true;
        });
        // If form is valid, it will be submit
        if (isValid)
        {
            if (typeof _this.onSubmit == 'function')
            {
                let data = getFormData();
                _this.onSubmit(data);
            }
            else {
                formElement.submit();
            }
        }
    }
    // Get form data
    function getFormData() {  
        // Get form input
        let formValues = Array.from(inputs).reduce((values, input) => {
            switch (input.type) {
                case 'radio':
                    if (input.matches(':checked')){
                        values[input.name] = input.value
                    }
                    else {
                        values[input.name] = ''
                    }
                    break;
                case 'checkbox':
                    if (!input.matches(':checked')) {
                        values[input.name] = ''
                        return values
                    }
                    if (!Array.isArray(values[input.name])){
                        values[input.name] = []
                    }
                    values[input.name].push(input.value)
                    break;
                case 'file':
                    values[input.name] = input.files
                    break;
                default:
                    values[input.name] = input.value
                    break;
            }
            return values
        }, {})
        return formValues;
    }
}