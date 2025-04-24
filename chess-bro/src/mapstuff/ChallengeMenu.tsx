import {challengeModeRef, exitChallengeView } from "./map";


export default function ChallengeMenu() {

    const opponent = challengeModeRef.selectedUser;

    return (
        <div className="w-1/4 flex flex-col items-center">
            FIGHT!
            <button onClick={exitChallengeView}>
                Close
            </button>
            <h1>{opponent?.username}</h1>
            {opponent?.rating}
        </div>
    )
}