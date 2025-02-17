import { plus } from '@wordle/domain/helper.js'

import {isOk, Result, unwrapResult} from "@wordle/domain/result.js";

const answer = plus(23, 19);

function div(a: number, b: number): Result<number, string> {
    if(b <= 0) {
        return { err: "Division by zero" }
    } else {
        return { value: a / b }
    }
}

console.log(`Hello! ${answer}`);

let result = div(12, 0)

if(isOk(result)) {
    console.log(`${ unwrapResult(result) }`)
} else {
    console.log(`${result.err}`)
}
