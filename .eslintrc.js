module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "no-unused-vars": 0,
        "no-inner-declarations": 0,
        "no-undef": 0,
        "no-prototype-builtins": 0,
        "no-extra-semi": 0,
        "no-useless-escape": 0,
        "no-empty": 0,
        "valid-typeof": 0,
        "no-constant-condition": 0,
        "no-compare-neg-zero": 0,
        "no-unused-labels": 0,
        "getter-return": 0
    }
}
