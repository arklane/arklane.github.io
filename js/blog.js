let blogPosts = [];
let selectedTags = new Set();
let currentSort = 'newest';

document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    
    // 添加排序监听器
    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        sortAndRenderPosts();
    });
});

// 加载博客文章
async function loadBlogPosts() {
    try {
        const response = await fetch('/blog-posts/list.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        blogPosts = await response.json();
        console.log('加载的博客文章:', blogPosts); // 添加调试日志
        renderTags();
        sortAndRenderPosts();
    } catch (error) {
        console.error('加载博客文章失败:', error);
        // 显示错误信息给用户
        document.querySelector('.blog-posts').innerHTML = '<p>加载博客文章失败，请稍后重试。</p>';
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
    // 清除其他标签的选中状态
    selectedTags.clear();
    
    // 如果点击的标签已经是激活状态，则取消选中
    const tagElement = document.querySelector(`[data-tag="${tag}"]`);
    if (tagElement.classList.contains('active')) {
        selectedTags.clear();
    } else {
        // 否则选中当前标签
        selectedTags.add(tag);
    }
    
    sortAndRenderPosts();
    updateTagsUI();
}

// 更新标签UI
function updateTagsUI() {
    // 更新所有标签的视觉状态
    document.querySelectorAll('.tag').forEach(tagElement => {
        tagElement.classList.remove('active');
    });
    
    // 高亮当前选中的标签
    selectedTags.forEach(tag => {
        const tagElement = document.querySelector(`[data-tag="${tag}"]`);
        if (tagElement) {
            tagElement.classList.add('active');
        }
    });
}

// 移除原有的 filterAndRenderPosts 函数
// 添加新的排序和渲染函数
function sortAndRenderPosts() {
    if (!Array.isArray(blogPosts) || blogPosts.length === 0) {
        console.log('没有博客文章可显示');
        return;
    }
    
    let sortedPosts = [...blogPosts];
    
    // 标签筛选
    if (selectedTags.size > 0) {
        sortedPosts = sortedPosts.filter(post =>
            post.tags.some(tag => selectedTags.has(tag))
        );
    }
    
    // 时间排序
    sortedPosts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return currentSort === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    renderPosts(sortedPosts);
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