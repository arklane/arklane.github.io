let blogPosts = [];
let selectedTags = new Set();

// 加载博客文章
async function loadBlogPosts() {
    try {
        const response = await fetch('/blog-posts/list.json');
        blogPosts = await response.json();
        renderTags();
        filterAndRenderPosts();
    } catch (error) {
        console.error('加载博客文章失败:', error);
    }
}

// 渲染标签过滤器
function renderTags() {
    const tags = new Set();
    blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    
    const tagFilter = document.querySelector('.tag-filter');
    tagFilter.innerHTML = Array.from(tags).map(tag => `
        <span class="tag" data-tag="${tag}">${tag}</span>
    `).join('');
    
    // 添加标签点击事件
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => toggleTag(tag.dataset.tag));
    });
}

// 切换标签选中状态
function toggleTag(tag) {
    if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
    } else {
        selectedTags.add(tag);
    }
    filterAndRenderPosts();
    updateTagsUI();
}

// 更新标签UI
function updateTagsUI() {
    document.querySelectorAll('.tag').forEach(tagElement => {
        const tag = tagElement.dataset.tag;
        tagElement.classList.toggle('active', selectedTags.has(tag));
    });
}

// 过滤并渲染文章
function filterAndRenderPosts() {
    let filteredPosts = blogPosts;
    if (selectedTags.size > 0) {
        filteredPosts = blogPosts.filter(post =>
            post.tags.some(tag => selectedTags.has(tag))
        );
    }
    
    const container = document.querySelector('.blog-posts');
    container.innerHTML = filteredPosts.map(post => `
        <article class="post-preview">
            <h3><a href="post.html?id=${post.id}">${post.title}</a></h3>
            <div class="post-meta">
                <time>${new Date(post.date).toLocaleDateString('zh-CN')}</time>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <p class="excerpt">${post.excerpt}</p>
        </article>
    `).join('');
}

// 初始化
document.addEventListener('DOMContentLoaded', loadBlogPosts);