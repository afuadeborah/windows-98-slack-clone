import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import { CommentType, PostType } from "../types";

const PAGE_SIZE = 2;

const fetchCommentsForPost = async (
	postId: number,
	pageNumber: number = 1
): Promise<CommentType[]> => {
	const params = new URLSearchParams({
		"per-page": PAGE_SIZE.toString(),
		page: pageNumber.toString(),
	});

	const response = await fetch(`/api/posts/${postId}/comments?${params}`);

	if (!response.ok) {
		throw new Error("Failed to fetch comments");
	}

	return response.json();
};

const SelectedPost = ({
	post,
	setSelectedPost,
}: {
	post: PostType;
	setSelectedPost: (post: PostType | null) => void;
}) => {
	const [comments, setComments] = useState<CommentType[]>([]);

	const hasNextPage =
		comments.length > 0 && comments.length < post.commentCount;

	const fetchMoreComments = () => {
		if (hasNextPage) {
			const pagesFetched = comments.length / PAGE_SIZE;
			const nextPage = pagesFetched + 1;
			fetchCommentsForPost(post.id, nextPage).then((comments) => {
				setComments((prevComments) => [...prevComments, ...comments]);
			});
		}
	};

	// Fetch the first page of comments on mount
	useEffect(() => {
		fetchCommentsForPost(post.id).then((comments) => {
			setComments(comments);
		});
	}, [post.id]);

	return (
		<>
			<div style={{ padding: "20px" }}>
				<button
					style={{ cursor: "pointer" }}
					onClick={() => setSelectedPost(null)}
				>
					Back
				</button>
				<h2
					style={{
						fontSize: "1.5em",
						fontWeight: "700",
						marginBottom: "10px",
					}}
				>
					{post.title}
				</h2>
				<p style={{ marginBottom: "10px" }}>{post.content}</p>
				<p>
					<strong>Author:</strong> {post.author}
				</p>
				<p>
					<strong>Posted on:</strong>{" "}
					{new Date(post.createdAt).toLocaleDateString()}
				</p>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						marginTop: "20px",
					}}
				>
					{comments.map((comment, index) => (
						<Comment
							key={comment.id}
							comment={comment}
							firstComment={index === 0}
						/>
					))}
				</div>
				{hasNextPage && (
					<button
						style={{ cursor: "pointer" }}
						onClick={fetchMoreComments}
					>
						Fetch more comments
					</button>
				)}
			</div>
		</>
	);
};

export default SelectedPost;
