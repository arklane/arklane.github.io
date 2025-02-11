document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    
    if (!postId) {
        window.location.href = '/blog.html';
        return;
    }

    try {
        const response = await fetch(`/blog-posts/${postId}.json`);
        const post = await response.json();
        
        document.title = `${post.title} - Yuxuan Huang的博客`;
        document.getElementById('post-title').textContent = post.title;
        document.getElementById('post-date').textContent = new Date(post.date).toLocaleDateString('zh-CN');
        document.getElementById('post-body').innerHTML = post.content;
        
        // 渲染标签
        document.getElementById('post-tags').innerHTML = post.tags
            .map(tag => `<span class="tag">${tag}</span>`)
            .join('');
            
        // 加载上一篇/下一篇文章
        loadAdjacentPosts(postId);
    } catch (error) {
        console.error('加载文章失败:', error);
    }
});

async function loadAdjacentPosts(currentId) {
    try {
        const response = await fetch('/blog-posts/list.json');
        const posts = await response.json();
        const currentIndex = posts.findIndex(post => post.id === currentId);
        
        if (currentIndex > 0) {
            const prevPost = posts[currentIndex - 1];
            document.querySelector('.prev-post').innerHTML = `
                <a href="post.html?id=${prevPost.id}">← ${prevPost.title}</a>
            `;
        }
        
        if (currentIndex < posts.length - 1) {
            const nextPost = posts[currentIndex + 1];
            document.querySelector('.next-post').innerHTML = `
                <a href="post.html?id=${nextPost.id}">${nextPost.title} →</a>
            `;
        }
    } catch (error) {
        console.error('加载相邻文章失败:', error);
    }
}
