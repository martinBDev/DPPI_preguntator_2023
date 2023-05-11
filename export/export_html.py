import json

def load_json(path):
    """
    Loads json in the following form:

    [
        {
            "topic": "Topic 1: title",
            "questions": [
            {
                "question": "¿What is the result of 3*3?",
                "options": [
                "2",
                "3",
                "9"
                ],
                "answer": 2,
                "explanation": "3 times 3 equals 9."
            },
            {}
            ]
        },
        {
            "topic": "Topic 2: title",
            "questions": []
        }
    ]

    """
    with open(path, 'r') as f:
        return json.load(f)


def export_html(entries_json):
    html = """
        <html>
            <head>
                <title>Tesst DPPI</title>
                <style>
                    body {
                        background-color: #f8f8f8;
                        color: #333;
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 1.5;
                        text-align: left;
                        margin: 0;
                        margin-left: 20px;
                        padding: 0;
                    }

                    h1 {
                        font-size: 24px;
                        margin: 40px 0 20px;
                    }

                    h2 {
                        font-size: 18px;
                        margin: 30px 0 15px;
                    }

                    p {
                        margin: 10px 0;
                    }

                    hr {
                        border: none;
                        border-top: 1px solid #ccc;
                        margin: 50px 0;
                    }

                    .okAnswer {
                        background-color: lightGreen;
                    }
                </style>
            </head>
            <body>
    """


    for topic in entries_json:
        html += f"<h1>{topic['topic']}</h1>"
        for question in topic['questions']:
            html += f"<h2>{question['question']}</h2>"
            for i, option in enumerate(question['options']):
                if i == question['answer']:
                    html += f"<p class='okAnswer'><b>{i+1}. {option}</b></p>"
                else:
                    html += f"<p>{i+1}. {option}</p>"
            html += f"<p>Answer: {question['answer'] + 1}</p>"
            html += f"<p>Explanation: {question['explanation']}</p>"
            html += "<hr>"
            
    html += "</body></html>"

    with open('questionnaire.html', 'w') as f:
        f.write(html)

def main():
    debug = True


    #load json file
    entries = load_json('../questions.json')

    #print every entry in entries (para que el copilot se entere)
    if debug:
        for entry in entries:
            print(entry["topic"])
            
            for question in entry["questions"]:
                print(question["question"])
                print(question["options"])
                print(question["answer"])
                print(question["explanation"])

    export_html(entries)
if __name__ == '__main__':
    main()