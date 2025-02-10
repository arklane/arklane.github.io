// 加载导航栏和底部
document.addEventListener('DOMContentLoaded', function() {
    // 加载导航栏
    fetch('components/navbar.html')
        .then(response => response.text())
        .then(data => document.getElementById('navbar').innerHTML = data);
    
    // 加载底部
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => document.getElementById('footer').innerHTML = data);
});

// 导航栏高亮当前页面
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath === linkPath || (currentPath === '/' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
});