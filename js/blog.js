// 动态加载博客列表
fetch('/blog-posts/list.json')
    .then(response => response.json())
    .then(posts => {
        const container = document.querySelector('.blog-posts');
        posts.forEach(post => {
            const postHTML = `
                <article class="post-preview">
                    <h3><a href="post.html?id=${post.id}">${post.title}</a></h3>
                    <div class="post-meta">
                        <time>${new Date(post.date).toLocaleDateString()}</time>
                        <span>${post.tags.join(', ')}</span>
                    </div>
                    <p class="excerpt">${post.excerpt}</p>
                </article>
            `;
            container.innerHTML += postHTML;
        });
    });