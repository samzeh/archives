import requests

url = "https://drive.google.com/uc?export=download&id=1AlW2r1rAkI4nAMKQVzp1-WrUIIqSx-UD"
output_path = "backend/model-backend/notebooks/artifacts.pkl.gz"

r = requests.get(url, allow_redirects=True)
with open(output_path, "wb") as f:
    f.write(r.content)