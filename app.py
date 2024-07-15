from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector
import numpy as np

app = Flask(__name__)
CORS(app,resources={r"/recommend": {"origins": "http://localhost:5001"}})
# Load your dataset

#data = pd.read_csv('C:/Users/LENOVO/Desktop/MyntraDataset and model/finalx.csv')
def get_data_from_mysql():
    connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='Diya@2809',
        database='Myntra'
    )
    query = "SELECT * FROM outfits"
    data = pd.read_sql(query, connection)
    connection.close()
    return data

data = get_data_from_mysql()
# Fit the vectorizer and compute cosine similarities
v = CountVectorizer(ngram_range=(1, 3))
v.fit(data['name'].values)
item_vectors = v.transform(data['name'])
cos_sim = cosine_similarity(item_vectors)

def recommendation(input_item):
    input_vector = v.transform([input_item])
    input_index = None
    for idx, name in enumerate(data['name']):
        if name.lower() == input_item.lower():
            input_index = idx
            break

    if input_index is None:
        return None, None, None
    else:
        similar_indices = np.argsort(cos_sim[input_index])[::-1][1:11]
        similar_item_names = data.iloc[similar_indices]['name'].values
        similar_item_img_urls = data.iloc[similar_indices]['img'].values
        similar_item_srno=data.iloc[similar_indices]['SrNo'].values
        return input_index, similar_item_names, similar_item_img_urls,similar_item_srno

# input_item = "tokyo talkies blue wide leg stretchable jeans"
# input_index, similar_item_names, similar_item_img_urls = recommendation(input_item)

# if input_index is not None:
#     print(f"Index of the input item: {input_index}")
#     print("Top 10 Similar Items (including the item itself):")
#     for name, img_url in zip(similar_item_names, similar_item_img_urls):
#         print(f"Name: {name}, Img URL: {img_url}")

@app.route('/recommend', methods=['POST'])
def recommend():
    input_item = request.json.get('item')
    if not input_item:
        return jsonify({'error': 'No item provided'}), 400

    input_index, similar_item_names, similar_item_img_urls,similar_item_srno = recommendation(input_item)
    if input_index is None:
        return jsonify({'error': 'Item not found in the dataset'}), 404

    response = {
        'input_index': input_index,
        'similar_items': [{'name': name, 'img_url': img_url, 'SrNo': int(SrNo)} for name, img_url, SrNo in zip(similar_item_names, similar_item_img_urls,similar_item_srno)]
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
        