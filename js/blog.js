let blogPosts = [];
let selectedTags = new Set();
let currentSort = 'newest';

document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    
    // 添加排序监听器
    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterAndRenderPosts();
    });
});

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
    let filteredPosts = [...blogPosts];
    
    // 标签筛选
    if (selectedTags.size > 0) {
        filteredPosts = filteredPosts.filter(post =>
            post.tags.some(tag => selectedTags.has(tag))
        );
    }
    
    // 时间排序
    filteredPosts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return currentSort === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    renderPosts(filteredPosts);
}

function renderPosts(posts) {
    const container = document.querySelector('.blog-posts');
    container.innerHTML = posts.map(post => `
        <article class="post-preview">
            <div class="post-meta">
                <time>${new Date(post.date).toLocaleDateString('zh-CN')}</time>
            </div>
            <h3><a href="post.html?id=${post.id}">${post.title}</a></h3>
            <p class="excerpt">${post.excerpt || ''}</p>
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </article>
    `).join('');
}