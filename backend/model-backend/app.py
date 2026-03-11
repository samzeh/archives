import pickle
import math
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods= ["*"],
    allow_headers=["*"],
)

with open('./data/processed/artifacts.pkl', 'rb') as f:
    artifacts = pickle.load(f)

group_text_result = artifacts['group_text_result']
genre_result = artifacts['genre_result']
user_rating_similarities = artifacts['user_rating_similarities']
book_id_list = artifacts['book_id_list']
# ratings_matrix = artifacts['ratings_matrix']  MAYBE REMOVE FROM HYRBID MODEL

books_df = pd.read_csv('./data/raw/books.csv')

def bookRecommendation(liked_book_id, top_k=5, already_recommended=None):
    liked_index = book_id_list.index(liked_book_id)  

    ratings_similarities = user_rating_similarities[liked_index]
    text_similarities = cosine_similarity(group_text_result[liked_index], group_text_result).flatten()
    genre_similarities = cosine_similarity(genre_result[liked_index], genre_result).flatten()

    similarities = 0.3 * ratings_similarities + 0.5 * text_similarities + 0.2 * genre_similarities

    similarities[liked_index] = -1  

    for seen_book_id in already_recommended:
        similarities[book_id_list.index(seen_book_id)] = -1

    top_indices = similarities.argsort()[-top_k:][::-1]
    recommended_books = []
  
    for i in top_indices:
        row = books_df[books_df['book_id'] == i+1]
        authors = safe_text(row['authors'].values[0])
        average_rating = row['average_rating'].values[0]
        description = safe_text(row['description'].values[0])
        genres = safe_text(row['genres'].values[0])
        image_url = safe_text(row['image_url'].values[0])
        isbn13 = row['isbn13'].values[0]
        pages = row['pages'].values[0]
        title = safe_text(row['title'].values[0])

        recommended_books.append({
            "title": title,
            "book_id": book_id_list[i],
            "authors": authors,
            "average_rating": safe_int(average_rating),
            "description": description,
            "genres": genres,
            "image_url": image_url,
            "isbn13": safe_int(isbn13),
            "pages": safe_int(pages)
        })
    return recommended_books

# recommended_books=bookRecommendation(68)

# print("Recommended id:")
# for book in recommended_books:
#     print("-", book["book_id"])

# print("Recommended titles:")
# for book in recommended_books:
#     print("-", book["title"])

liked_book_id = 68  # "Perks of Being a Wallflower"
# bookRecommendation(liked_book_id)
def getBookDetails(book_id):

    row = books_df[books_df['book_id'] == book_id]
    authors = safe_text(row['authors'].values[0])
    average_rating = safe_int(row['average_rating'].values[0])
    description = safe_text(row['description'].values[0])
    genres = safe_text(row['genres'].values[0])
    image_url = safe_text(row['image_url'].values[0])
    isbn13 = safe_int(row['isbn13'].values[0])
    pages = safe_int(row['pages'].values[0])
    title = safe_text(row['title'].values[0])
    return title, authors, average_rating, description, genres, image_url, isbn13, pages


def safe_int(value, default=0):
    try:
        if pd.isna(value):
            return default
        return int(value)
    except (ValueError, TypeError):
        return default


def safe_text(value, default=''):
    if pd.isna(value):
        return default
    return str(value)


def sanitize_for_json(value):
    if isinstance(value, dict):
        return {k: sanitize_for_json(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [sanitize_for_json(v) for v in value]

    if hasattr(value, 'item'):
        try:
            value = value.item()
        except Exception:
            pass

    if isinstance(value, float):
        return value if math.isfinite(value) else None

    if pd.isna(value):
        return None

    return value

@app.get("/recommendation-graph/{liked_book_id}")
def createRecommendationGraph(
    liked_book_id: int,
    depth:int =3,
    top_k:int=5,
    nodes=None,
    links=None,
    already_recommended=None,
    node_counter=None,
    book_id_to_node_id=None
):
    if nodes is None:
        nodes = []
    if links is None:
        links = []
    if already_recommended is None:
        already_recommended = set()
    if node_counter is None:
        node_counter = [0]
    if book_id_to_node_id is None:
        book_id_to_node_id = {}

    if liked_book_id not in already_recommended:
        node_id = node_counter[0]
        node_counter[0] += 1

        title, authors, avg_rating, desc, genres, img, isbn, pages = getBookDetails(liked_book_id)
        nodes.append({
            "id": node_id,
            "book_id": liked_book_id,
            "label": title,
            "authors": authors,
            "average_rating": avg_rating,
            "description": desc,
            "genres": genres,
            "image_url": img,
            "isbn13": isbn,
            "pages": pages
        })
        already_recommended.add(liked_book_id)
        book_id_to_node_id[liked_book_id] = node_id

    source_id = book_id_to_node_id[liked_book_id]

    recommended_books = bookRecommendation(liked_book_id, top_k, already_recommended)

    for book in recommended_books:
        book_id = book["book_id"]
        is_new = book_id not in already_recommended

        # Assign node ID — either new or existing
        if is_new:
            target_id = node_counter[0]
            node_counter[0] += 1
            nodes.append({
                "id": target_id,
                "book_id": book_id,
                "label": book["title"],
                "authors": book["authors"],
                "average_rating": safe_int(book["average_rating"]),
                "description": book["description"],
                "genres": book["genres"],
                "image_url": book["image_url"],
                "isbn13": safe_int(book["isbn13"]),
                "pages": safe_int(book["pages"])
            })
            already_recommended.add(book_id)
            book_id_to_node_id[book_id] = target_id
        else:
            target_id = book_id_to_node_id[book_id]

        # Always create the link
        links.append({"source": source_id, "target": target_id})

        # Always recurse — even if node already exists
        if depth > 1:
            createRecommendationGraph(
                book_id,
                depth - 1,
                top_k,
                nodes,
                links,
                already_recommended,
                node_counter,
                book_id_to_node_id
            )

    return sanitize_for_json({"nodes": nodes, "links": links})
# nodes, links = createRecommendationGraph(68)
# print("Nodes:", nodes)
# print("Links:", links)

