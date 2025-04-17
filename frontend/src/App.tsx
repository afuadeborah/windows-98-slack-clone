import React from "react";
import PostsPage from "./components/PostsPage";
import "./styles/scss/styles.scss";
import "98.css";
import Footer from "./components/Footer";

const App: React.FC = () => {
	return (
		<div>
			<PostsPage />
			<Footer />
		</div>
	);
};

export default App;
