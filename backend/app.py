from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow 
from datetime import datetime 
import spacy
from spacy.lang.en import English
import pandas as pd

from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/dictionarydb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)
app.app_context().push()

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")


class DictionaryWords(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    language = db.Column(db.String(30), nullable=True)
    word = db.Column(db.String(100), nullable=True)
    english_meaning = db.Column(db.String(100), nullable=True)
    hindi_meaning = db.Column(db.String(100), nullable=True)
    sanskrit_meaning = db.Column(db.String(100), nullable=True)
    chinese_meaning = db.Column(db.String(100), nullable=True)
    marathi_meaning = db.Column(db.String(100), nullable=True)
    tibetan_meaning = db.Column(db.String(100), nullable=True)
    pos = db.Column(db.String(100), nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, language, word, english_meaning,hindi_meaning,sanskrit_meaning,chinese_meaning,marathi_meaning,tibetan_meaning,pos):
        self.language = language
        self.word = word
        self.english_meaning = english_meaning
        self.hindi_meaning = hindi_meaning
        self.sanskrit_meaning = sanskrit_meaning
        self.chinese_meaning = chinese_meaning
        self.marathi_meaning = marathi_meaning
        self.tibetan_meaning = tibetan_meaning
        self.pos = pos

class UserRegisterd(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    date_registered = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

class SearchHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    searched_word = db.Column(db.String(100), nullable=False)
    language = db.Column(db.String(30), nullable=False)
    date_searched = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, searched_word, language):
        self.username = username
        self.searched_word = searched_word
        self.language = language
        



class DictionaryWordSchema(ma.Schema):
    class Meta:
        fields = ('id', 'language', 'word', 'english_meaning','hindi_meaning','sanskrit_meaning','chinese_meaning','marathi_meaning','tibetan_meaning', 'pos', 'date_created')
dictionarywords_schema = DictionaryWordSchema()
dictionarywords_schemas = DictionaryWordSchema(many=True)


class UserRegisteredSchema(ma.Schema):
    class Meta:
        fields = ('id','username','email', 'password', 'date_registered')
userRegistered_schema = UserRegisteredSchema()


class RecentSearcheSchema(ma.Schema):
    class Meta:
        fields = ('id','username', 'searched_word', 'language', 'date_searched')
recentSearch_schemas = RecentSearcheSchema(many=True)


nlp = spacy.load('en_core_web_sm')
def preprocess_text(text):
    return text.lower()
def lemmatize_text(text):
    doc = nlp(text)
    lemmatized_words = [token.lemma_ for token in doc]
    return ' '.join(lemmatized_words)

#show all words present in DB
@app.route('/api', methods=['GET'])
def readAPI():
    allDictionaryWords = DictionaryWords.query.all()
    return dictionarywords_schemas.jsonify(allDictionaryWords)

#show selected language words present in DB
@app.route('/api/<string:selectedLanguage>', methods=['GET'])
def selectedLanguageAPI(selectedLanguage):
    DictionaryWords_by_language = DictionaryWords.query.filter_by(language=selectedLanguage).all()   
    return dictionarywords_schemas.jsonify(DictionaryWords_by_language)


#search word from database
@app.route('/api/<string:selectedLanguage>/<string:word>', methods=['GET'])
def searchWord(selectedLanguage,word):
    processed_word = preprocess_text(word)
    lemmatized_word = lemmatize_text(processed_word)
    allSearchWords = DictionaryWords.query.filter_by(language = selectedLanguage, word=lemmatized_word).first()
    if not allSearchWords:
        return jsonify({'error': 'Word not found'}), 404
    return dictionarywords_schema.jsonify(allSearchWords)

#for Incremental search Suggestion
@app.route('/api/suggestions/<string:selectedLanguage>/<string:input>', methods=['GET'])
def get_suggestions(selectedLanguage, input):
    processed_input = preprocess_text(input)
    lemmatized_input = lemmatize_text(processed_input)
    suggestions = DictionaryWords.query.filter_by(language=selectedLanguage).filter(DictionaryWords.word.like(f'{lemmatized_input}%')).all()
    return dictionarywords_schemas.jsonify(suggestions)

#search history
@app.route('/history', methods=['POST'])
def search_history():
    username = request.json.get('username')
    searched_word = request.json.get('word')
    language = request.json.get('language')
    user_history = SearchHistory(username= username, searched_word=searched_word, language = language)
    db.session.add(user_history)
    db.session.commit()
    return jsonify({"message":"user search history updated:"})

@app.route('/recent', methods=['POST'])
def recent():
    username = request.json.get('username')
    searched_words = SearchHistory.query.filter_by(username=username).all()
    return recentSearch_schemas.jsonify(searched_words)
    

    


#Resitration endpiont
@app.route('/registration', methods=['POST'])
def register():
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')
    confirm_password = request.json.get('confirmPassword')

    #perform validation
    if not username:
        return jsonify({'error': 'Invalid username'})
    if not email:
        return jsonify({'error': 'Invalid email'})
    if not password:
        return jsonify({'error': 'Invalid password'})
    if password!=confirm_password:
        return jsonify({'error': 'Invalid confirm password'})
    
    user = UserRegisterd.query.filter_by(email=email).first()
    if user:
        return jsonify({"error":"Email has already been registered"})
        
    new_user = UserRegisterd(username=username, email=email, password=password)

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message":"Registration successful"})

#Login Endpoint
@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    errors = []
    if not email:
        errors.append('Fill email field')
    if not password:
        errors.append('Fill password')
    if errors:
        return jsonify({'errors':errors})

    user = UserRegisterd.query.filter_by(email=email).first()

    if user and user.password==password:
        return userRegistered_schema.jsonify(user)
    else:
        return jsonify({'error': 'Invalid Login'})


# image code

@app.route('/image-upload', methods=['POST'])
def upload_image():
    if "image" in request.files:
        # Get the uploaded image
        uploaded_image = request.files["image"]
        if uploaded_image.filename != "":
            # Process the image here (e.g., image captioning)
            raw_image = Image.open(uploaded_image).convert('RGB')
            caption=recognize_image(raw_image)
            print(f"Image caption: {caption}")  # Print the caption for debugging

            return jsonify({"message": caption})

    return jsonify({"error": "No image uploaded"})


def recognize_image(raw_image):
    try:
       
        # Perform image captioning
        inputs = processor(raw_image, return_tensors="pt")
        output = model.generate(**inputs)

        # Decode and return the recognized text
        recognized_text = processor.decode(output[0], skip_special_tokens=True)
        return recognized_text

    except Exception as e:
        return 'error occured'

  #adding data in database from excel
@app.route('/import-data', methods=['POST'])
def import_data():
    try:
        # Specify the path to your Excel file
        excel_file_path = "C:/Users/abhi2/Desktop/a.xlsx"

        # Read data from Excel using pandas
        df = pd.read_excel(excel_file_path)

        # Iterate through the rows and add each record to the database
        for index, row in df.iterrows():
            new_word = DictionaryWords(
                language=row['Language'],
                word=row['Word'],
                english_meaning=row['English Meaning'],
                hindi_meaning=row['Hindi Meaning'],
                sanskrit_meaning=row['Sanskrit Meaning'],
                chinese_meaning=row['Chinese Meaning'],
                marathi_meaning=row['Marathi Meaning'],
                tibetan_meaning=row['Tibetan Meaning'],
                pos=row['Pos'],
            )

            db.session.add(new_word)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Data imported successfully"})

    except Exception as e:
        return jsonify({"error": str(e)})



if __name__ == "__main__":
    app.run(port= 3000, debug=True)
