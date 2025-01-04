# Social Media Backend API

A backend implementation for a social media application built with Node.js, Express, and MongoDB. This API provides features for user authentication, post management, and social interactions like following/unfollowing users and liking/disliking posts.

---

## Features

### Authentication
- **Register**: Create a new user with email, username, and password.
- **Login**: Authenticate an existing user and generate a JWT token.
- **Logout**: Log out the user by invalidating their token.

### User Management
- Update user profile information, including username, password, and other details.
- Delete user account.
- Fetch current user profile information.
- Follow and unfollow other users.

### Post Management
- Create a new post.
- Update an existing post (only by the post owner).
- Delete a post (only by the post owner).
- Like and dislike posts.
- Fetch individual posts and timelines, including posts from followed users.

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version 14 or later)
- [MongoDB](https://www.mongodb.com/) (running instance)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name



## API Endpoints
### Authentication
- **POST** `/auth/register` - Register a new user.
- **POST** `/auth/login` - Log in and retrieve an auth token.
- **POST** `/auth/logout` - Log out the current user.

### User Management
- **PUT** `/users/update` - Update user profile.
- **DELETE** `/users/delete` - Delete user account.
- **GET** `/users/myAccount` - Retrieve user profile information.
- **POST** `/users/follow/:name` - Follow a user.
- **POST** `/users/unfollow/:name` - Unfollow a user.

### Post Management
- **POST** `/posts/create` - Create a new post.
- **PATCH** `/posts/update/:id` - Update a post.
- **DELETE** `/posts/delete/:id` - Delete a post.
- **PATCH** `/posts/like/:id` - Like a post.
- **PATCH** `/posts/dislike/:id` - Dislike a post.
- **GET** `/posts/get/:id` - Retrieve a specific post.
- **GET** `/posts/getAll` - Retrieve all posts (timeline).
