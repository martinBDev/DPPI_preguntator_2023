import json
from bs4 import BeautifulSoup
import re
import glob
from difflib import SequenceMatcher
"""
Un script para añadir y detectar colisiones directamente al json
"""

def cleanHtm(txt:str) -> str:
	fmt = re.compile(r'[a-z]\.\s+')
	return fmt.sub('', txt.replace('\t','').replace('\n',' ').strip()).strip()
	
	


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
		answers = questionField.find('div', {'class': 'answer'})
		# conseguir preguntas
		for idx, answer in enumerate(answers):
			if not cleanHtm(answer.text): continue
			if 'correct' in str(answer):
				# el indice es doble por algún motivo
				question['answer'] = idx // 2
	
			question['options'].append(cleanHtm(answer.text))

		questions.append(question)
		# cosneguir retroalimentación
		feedback = questionField.parent.find('div', {'class': 'generalfeedback'})
		if feedback:
			question['explanation'] = cleanHtm(feedback.text)

	return questions

def similar(a, b):
	return SequenceMatcher(None, a, b).ratio()

def mergeData(data:dict, topic:str, questions: dict):
	theme = data[topic - 1]

	for question in questions:
		# check for repeated
		repeated = False
		for originalQuestion in theme['questions']:
			if similar(question['question'], originalQuestion['question']) > .95:
				repeated = True
		if not repeated:
			theme['questions'].append(question)

	return data
		
	

def main():
	# conseguir archivos
	htms = glob.glob('*.html')
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