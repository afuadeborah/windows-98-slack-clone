from flask import Flask
from flask_cors import CORS
from models import db

from api.posts import posts

# Initialization
app = Flask(__name__)
CORS(app)

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///slack_clone.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
db.create_all(app=app)

app.register_blueprint(posts, url_prefix="/api")

# Main entry
if __name__ == "__main__":
    app.run(debug=True)
