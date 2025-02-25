/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    return { 
        questions: [
            {
                "type": "true_false",
                "question": "lorem ipsum",
                "statements": [
                    {
                        "statement": "lorem",
                        "answers": true
                    },
                    {
                        "statement": "ip sum",
                        "answers": false
                    },
                    {
                        "statement": "tcpip",
                        "answers": true
                    },
                    {
                        "statement": "net stack",
                        "answers": false
                    }
                ]
            },
            {
                "type": "multiple_choice",
                "question": "ez?",
                "answers": {
                    "A": "yes",
                    "B": "no",
                    "C": "maybe",
                    "D": "idk",
                    "correct": "A"
                }
            },
        ]
    }
}