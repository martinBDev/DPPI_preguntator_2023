# Script Automático para añadir las preguntas
## Como funciona
Muy simple, vete a los cuestionarios y descargalos, en firefox es con ctrl + s, no tengo ni idea como va en otros buscadores.
Cuando lo descargues, guardalo en este carpeta, no se va a añadir al repo, no te preocupes. Una vez que tengas los cuestionarios descargados, solo tienes que usar el script, debería ir automático. Tampoco te preocupes por colisiones, el achivo se encarga de eso también.

**FIREFOZ DESCARGA LOS FICHEROS CON EXTENSION .HTM; CHROME CON EXTENSION .HTML. EL SCRIPT USA HTML, RECOMENDAMOS CAMBIAR LA EXTENSIÓN DE LOS FICHEROS A .HTML O CAMBIAR LA LINEA 67 DEL SCRIPT PARA QUE LEA .HTM, LO QUE EL USUARIO QUIERA**

## Resultados
El archivo **NO** reemplaza el questions.json original, crea una copia en esta carpeta llamada questions.copy.json. Una vez que haya confirmado que el script ha funcionado, puedes reemplazar el json original. Muchas gracias
## **⚠⚠IMPORTANTE⚠⚠**
**NECESITAS BeautifullSoup para que esto funcione.**
```bash
python -m pip install beautifulsoup4
``` 
Pon esto en la consola, y si tienes python metido en la ruta debería ir sin problemas. Si ves que te da error y no encuntra el módulo, haz lo siguiente:

1 - Entra en la carpeta del script
2 - Instala entorno virtual de python:
```bash
python -m pip install --user virtualenv
``` 
3 - Crea el entorno DENTRO DE LA CARPETA DEL SCRIPT
```bash
python -m venv .
``` 
Importante incluir el punto "."
4 - Ejecuta el entorno:
```bash
.\Scripts\activate
``` 
5 - Instala de nuevo BeautifullSoup
```bash
pip install beautifulsoup4
```

Ejecuta el script con los HTML en la carpeta (no les cambies el nombre):
```bash
py .\addQuestion.py
```