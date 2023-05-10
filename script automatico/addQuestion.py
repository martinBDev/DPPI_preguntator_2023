import json
from bs4 import BeautifulSoup
import glob
"""
Un script para añadir y detectar colisiones directamente al json
"""

def cleanHtm(txt:str) -> str:
	return txt.replace('\t','').replace('\n',' ').replace('  ', ' ').strip()
	
	


def parseHtm(htmFile:str) -> dict:
	with open(htmFile, 'r', encoding='utf-8') as f:
		htmlfile = f.read()
		soup = BeautifulSoup(htmlfile, 'html.parser')

	questions = []
	for questionField in soup.find_all('div', {'class': 'formulation'}):
		question = {
			'question': cleanHtm(questionField.find('div').text),
			'options': [],
			'answer': -1,
			'explanation': '...'
		}
		correctTag = questionField.parent.find('div', {'class': 'rightanswer'})
		correctText = cleanHtm(correctTag.text).replace('La respuesta correcta es: ','')
		# enumerar por preguntas
		for idx, answer in enumerate(questionField.find_all('div', {'data-region': 'answer-label'})):
			answerText = cleanHtm(answer.div.text)
			question['options'].append(answerText)
			if correctText == answerText:
				question['answer'] = idx
		
		questions.append(question)
		# conseguir retroalimentación
		feedback = questionField.parent.find('div', {'class': 'generalfeedback'})
		if feedback:
			question['explanation'] = f'{cleanHtm(feedback.text)}\n{correctText}'

	return questions


def mergeData(data:dict, topic:str, questions: dict):
	theme = data[topic - 1]

	for question in questions:
		# buscar colisiones
		repeated = False
		for originalQuestion in theme['questions']:
			# hay preguntas con el mismo enunciado pero distintas opcions, si la pregunta y la explicación es la misma, está repetida
			if question['question'] == originalQuestion['question']:
				if len(set(question['options'] + originalQuestion['options'])) == len(question['options']):
					repeated = True
		if not repeated:
			theme['questions'].append(question)

	return data
		
	

def main():
	# conseguir archivos
	htms = glob.glob('*.htm*')
	with open('../questions.json', 'r', encoding='utf-8') as f:
		data = json.loads(f.read())

	for htm in htms:
		# conseguir tema
		topic = int(htm.split(' ')[3].replace('.',''))
		# conseguir preguntas
		questions = parseHtm(htm)
		# juntar datos
		data = mergeData(data, topic, questions)
		
	# guardar datos
	with open('questions.copy.json', 'w', encoding='utf-8') as f:
		f.write(json.dumps(data, ensure_ascii=False, indent=2))


if __name__ == '__main__':
	main()