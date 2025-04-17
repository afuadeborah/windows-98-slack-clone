import React, { useState, useEffect, FormEvent } from "react";
import { PostType } from "../types";
import Post from "./Post";
import SelectedPost from "./SelectedPost";

const fetchPosts = async (): Promise<PostType[]> => {
	const response = await fetch("/api/posts");

	if (!response.ok) {
		throw new Error("Failed to fetch posts");
	}

	return response.json();
};

const PostsPage = () => {
	const [posts, setPosts] = useState<PostType[]>([]);
	const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
	const [loading, setLoading] = useState(false);
	// add post
	const [title, setTitle] = useState<PostType["title"]>("");
	const [content, setContent] = useState<PostType["content"]>("");

	useEffect(() => {
		const loadPosts = async () => {
			try {
				const fetchedPosts = await fetchPosts();
				setPosts(fetchedPosts);
			} catch (error) {
				console.error("Failed to load posts:", error);
			}
		};

		loadPosts();
	}, []);

	if (selectedPost) {
		return (
			<SelectedPost
				post={selectedPost}
				setSelectedPost={setSelectedPost}
			/>
		);
	}

	const handleCreatePost = async (event: React.FormEvent) => {
		// prevent default
		event.preventDefault();
		// set up loading state
		setLoading(true);
		try {
			// set up response
			const response = await fetch("/api/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, content, user_id: 1 }),
			});
			// validate response is ok
			if (!response.ok)
				throw new Error(
					`Response error creating post: ${response.status}`
				);
			// add new post to posts array in state
			const newPost: PostType = await response.json();
			setPosts([newPost, ...posts]);
			// clear inputs, loading
			setTitle("");
			setContent("");
			setLoading(false);
		} catch (error) {
			console.error("Error creating post", error);
			setLoading(false);
		}
	};

	const deletedPost = (deletedPost: PostType | null) => {
		// go through posts and filter out the post passed into this function from the child
		if (deletedPost) {
			setPosts(posts.filter((post) => deletedPost.id === post.id));
		}
	};

	return (
		<div className='window m-4'>
			<div className='title-bar'>
				<h1 className='title-bar-text'>Slack - Posts</h1>
				<div className='title-bar-controls'>
					<button aria-label='Minimize'></button>
					<button aria-label='Maximize' disabled></button>
					<button aria-label='Close'></button>
				</div>
			</div>
			<div className='post-page__container d-flex flex-column bg-white mb-3 py-1'>
				{posts.map((post) => (
					<Post
						key={post.id}
						post={post}
						setSelectedPost={setSelectedPost}
						deletedPost={deletedPost}
					/>
				))}
			</div>
			<div className='m-3'>
				<form
					className='d-flex flex-column'
					onSubmit={handleCreatePost}
				>
					<strong className='mb-3'>Add Post</strong>
					<label htmlFor='title'>Title</label>
					<input
						type='text'
						id='title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<label htmlFor='content'>Content</label>
					<textarea
						name='content'
						id='content'
						maxLength={500}
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
					<button
						className='mt-sm-3'
						type='submit'
						disabled={loading}
					>
						Create post
					</button>
				</form>
			</div>
			<div className='status-bar'>
				<p className='status-bar-field'>Press F1 for help</p>
				<p className='status-bar-field'>Slide 1</p>
				<p className='status-bar-field'>CPU Usage: 44%</p>
			</div>
		</div>
	);
};

export default PostsPage;
