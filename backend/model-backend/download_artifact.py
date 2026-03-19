import gdown
import os

url = "https://drive.google.com/uc?export=download&id=1AlW2r1rAkI4nAMKQVzp1-WrUIIqSx-UD"
output_path = "notebooks/artifacts.pkl.gz"

os.makedirs(os.path.dirname(output_path), exist_ok=True)
gdown.download(url, output_path, quiet=False)