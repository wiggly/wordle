import { plus } from '@wordle/domain/helper'

import { Result } from "@wordle/domain/result";

const answer = plus(23, 19);

function div(a: number, b: number): Result<number, string> {
    if(b <= 0) {
        return { err: "Division by zero" }
    } else {
        return { value: a / b }
    }
}

console.log(`Hello! ${answer}`);

console.log(`${ JSON.stringify(div(12, 0)) }`)

