import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Post = (props) => (
    <tr>
        <td>{props.post.user}</td>
        <td>{props.post.content}</td>
        <td>
            {props.post.image && (
                <img
                src={`data:image/jpeg;base64,${props.post.image}`} // convert base64 string to image
                alt="PostImage"
                style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} // ensure the image fits within the size limits
                />
            )}
        </td>
        <td>
            <button className="btn btn-link"
            onClick={() => {
                props.deletePost(props.post._id);
            }}
            >
                Delete
            </button>
        </td>
    </tr>
);

export default function PostList(){
    const [posts, setPosts] = useState([]);

    //this method fetches the posts from the database.
    useEffect(() => {
        async function getPosts(){
            const response = await fetch(`https://localhost:3001/post/`);

            if (!response.ok) {
                const message = `An error occured: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const posts = await response.json();
            setPosts(posts);
        }

        getPosts();

        return;
    }, [posts.length]);

    //this method will delete a post
    async function deletePost(id) {
        const token = localStorage.getItem("jwt");
        await fetch(`https://localhost:3001/post/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const newPosts = posts.filter((el) => el._id !== id);
        setPosts(newPosts);
    }

    //this method will map out the posts on the table
    function PostList() {
        return posts.map((post) => {
            return(
                <Post
                post={post}
                deletePost={() => deletePost(post._id)}
                key={post._id}
                />
            );
        });
    }

    return(
        <body>
            <div className="container">
            <h3 className="header">APDS notice Board</h3>
            <table className="table table-striped" style={{marginTop:20}}>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Caption</th>
                        <th>Image</th>
                        <th>Actions</th> {/* Added column for actions */}
                    </tr>
                </thead>
                <tbody>{PostList()}</tbody>
            </table>
            </div>
        </body>
    )
}