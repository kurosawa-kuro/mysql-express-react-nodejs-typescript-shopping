import React, { useState } from "react";
import axios from "axios";

interface NewPost {
  title: string;
  body: string;
  userId: number;
}

interface CreatedPost extends NewPost {
  id: number;
}

export const InformationPostScreen: React.FC = () => {
  const [post, setPost] = useState<NewPost>({ title: "", body: "", userId: 1 });
  const [createdPosts, setCreatedPosts] = useState<CreatedPost[]>([]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPost({
      ...post,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await axios.post<CreatedPost>(
      "https://jsonplaceholder.typicode.com/posts",
      post
    );
    const newPost = response.data;
    setCreatedPosts((prevPosts) => [...prevPosts, newPost]);

    setPost({ title: "", body: "", userId: 1 }); // Clear form
  };

  return (
    <>
      <div className="mx-auto w-1/3">
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-custom-blue-darkest">
              Title:{" "}
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={post.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-custom-blue px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-custom-blue-darkest">
              Body:{" "}
            </label>
            <textarea
              id="body"
              name="body"
              value={post.body}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-custom-blue px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-custom-blue px-4 py-2 text-white"
          >
            Submit
          </button>
        </form>

        <ul className="mt-4 space-y-4">
          {createdPosts.map((post, index) => (
            <li
              key={index}
              className="rounded-md border-2 border-custom-blue p-4"
            >
              <h2 className="text-2xl text-custom-blue-darkest">
                {post.title}
              </h2>
              <p className="mt-2 text-custom-blue-dark">{post.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
