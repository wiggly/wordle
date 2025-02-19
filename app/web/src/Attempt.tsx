import {LetterAttempt} from "@wordle/domain/entity.js";

import './style.css'

export type AttemptArgs = { id: string, letters: Array<LetterAttempt> }

export function Attempt({id, letters}: AttemptArgs) {

    const letterSpans = letters.map( (letter, index) => {
        const elementId = `${id}-${index}`
        const stateClass = `letter ${letter.state.toLowerCase()}`

        return (<span id={elementId} className={stateClass}>{letter.letter}</span>);
    })

    console.log(`Attempt created ${letterSpans.length} letter boxes`)

    return (
        <div className={"attempt"}>
            {letterSpans}
        </div>
    );
}
