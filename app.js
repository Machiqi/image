const apiBaseUrl = 'https://crudcrud.com/api/a4e6957618234652a720fa28a421e9bd/blogs';

// Fetch and display blogs on load
window.onload = () => {
    fetchBlogs();
};

async function fetchBlogs() {
    try {
        const response = await axios.get(apiBaseUrl);
        const blogs = response.data;
        document.getElementById('total-blogs').innerText = blogs.length;
        displayBlogs(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
}

function displayBlogs(blogs) {
    const container = document.getElementById('blog-container');
    container.innerHTML = ''; 

    blogs.forEach(blog => {
        const blogElement = document.createElement('div');
        blogElement.classList.add('blog');
        blogElement.innerHTML = `
            <img src="${blog.imageUrl}" alt="Blog Image">
            <h2>${blog.title}</h2>
            <p>${blog.description}</p>
            <div class="blog-buttons">
                <button class="edit" onclick="editBlog('${blog._id}', '${blog.title}', '${blog.description}', '${blog.imageUrl}')">Edit</button>
                <button class="delete" onclick="deleteBlog('${blog._id}')">Delete</button>
            </div>
        `;
        container.prepend(blogElement);
    });
}

async function postBlog() {
    const imageUrl = document.getElementById('image-url').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (!imageUrl || !title || !description) {
        alert('Please fill all fields');
        return;
    }

    const newBlog = { imageUrl, title, description };

    try {
        await axios.post(apiBaseUrl, newBlog);
        fetchBlogs();
        clearForm();
    } catch (error) {
        console.error('Error posting blog:', error);
    }
}

function clearForm() {
    document.getElementById('image-url').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
}

async function deleteBlog(id) {
    try {
        await axios.delete(`${apiBaseUrl}/${id}`);
        fetchBlogs();
    } catch (error) {
        console.error('Error deleting blog:', error);
    }
}

function editBlog(id, title, description, imageUrl) {
    document.getElementById('title').value = title;
    document.getElementById('description').value = description;
    document.getElementById('image-url').value = imageUrl;

    const button = document.querySelector('.blog-form button');
    button.innerText = 'Edit Blog';
    button.onclick = async () => {
        const updatedBlog = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            imageUrl: document.getElementById('image-url').value,
        };

        try {
            await axios.put(`${apiBaseUrl}/${id}`, updatedBlog);
            fetchBlogs();
            clearForm();
            button.innerText = 'Post Blog';
            button.onclick = postBlog;
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };
}
