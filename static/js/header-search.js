// 头部搜索功能
class HeaderSearch {
    constructor() {
        this.searchButton = document.getElementById('globalSearch');
        this.searchInput = document.getElementById('searchInput');
        this.searchClose = document.getElementById('searchClose');
        this.searchResults = document.getElementById('searchResults');
        this.searchIcon = this.searchButton.querySelector('.search-icon');
        
        this.isOpen = false;
        this.searchData = null;
        this.fuse = null;
        
        this.init();
    }
    
    init() {
        // 绑定事件
        this.searchButton.addEventListener('click', (e) => this.handleButtonClick(e));
        this.searchClose.addEventListener('click', (e) => this.handleCloseClick(e));
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.searchInput.addEventListener('click', (e) => e.stopPropagation());
        
        // 点击外部关闭搜索
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // 加载搜索数据
        this.loadSearchData();
    }
    
    handleButtonClick(e) {
        e.stopPropagation();
        if (!this.isOpen) {
            this.openSearch();
        }
    }
    
    handleCloseClick(e) {
        e.stopPropagation();
        this.closeSearch();
    }
    
    async loadSearchData() {
        try {
            const response = await fetch('/index.json');
            this.searchData = await response.json();
            
            // 初始化Fuse.js
            const fuseOptions = {
                shouldSort: true,
                includeMatches: true,
                threshold: 0.3,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    {name: "title", weight: 0.8},
                    {name: "contents", weight: 0.5},
                    {name: "tags", weight: 0.3}
                ]
            };
            
            this.fuse = new Fuse(this.searchData, fuseOptions);
        } catch (error) {
            console.error('Failed to load search data:', error);
        }
    }
    
    openSearch() {
        this.isOpen = true;
        this.searchButton.classList.add('search-expanded');
        this.searchInput.focus();
    }
    
    closeSearch() {
        this.isOpen = false;
        this.searchButton.classList.remove('search-expanded');
        this.searchInput.value = '';
        this.searchResults.innerHTML = '';
        this.searchResults.classList.remove('show');
    }
    
    handleSearch(query) {
        if (!query.trim() || !this.fuse) {
            this.searchResults.innerHTML = '';
            this.searchResults.classList.remove('show');
            return;
        }
        
        const results = this.fuse.search(query);
        this.displayResults(results, query);
    }
    
    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="search-no-results">没有找到相关内容</div>';
            this.searchResults.classList.add('show');
            return;
        }
        
        let html = '';
        results.slice(0, 8).forEach((result, index) => {
            const item = result.item;
            const snippet = this.createSnippet(item.contents, query);
            
            html += `
                <div class="search-result-item" data-index="${index}">
                    <a href="${item.permalink}" class="search-result-link">
                        <div class="search-result-title">${this.highlightText(item.title, query)}</div>
                        <div class="search-result-snippet">${snippet}</div>
                        ${item.tags ? `<div class="search-result-tags">${item.tags.join(', ')}</div>` : ''}
                    </a>
                </div>
            `;
        });
        
        this.searchResults.innerHTML = html;
        this.searchResults.classList.add('show');
    }
    
    createSnippet(content, query) {
        const maxLength = 120;
        const queryLower = query.toLowerCase();
        const contentLower = content.toLowerCase();
        
        let startIndex = contentLower.indexOf(queryLower);
        if (startIndex === -1) {
            startIndex = 0;
        } else {
            startIndex = Math.max(0, startIndex - 30);
        }
        
        let snippet = content.substring(startIndex, startIndex + maxLength);
        if (startIndex > 0) snippet = '...' + snippet;
        if (startIndex + maxLength < content.length) snippet += '...';
        
        return this.highlightText(snippet, query);
    }
    
    highlightText(text, query) {
        if (!query.trim()) return text;
        
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    handleKeydown(e) {
        if (e.key === 'Escape') {
            this.closeSearch();
        } else if (e.key === 'Enter') {
            // 如果有搜索结果，跳转到第一个结果
            const firstResult = this.searchResults.querySelector('.search-result-link');
            if (firstResult) {
                window.location.href = firstResult.href;
            }
        }
    }
    
    handleOutsideClick(e) {
        if (this.isOpen && !this.searchButton.contains(e.target) && !this.searchResults.contains(e.target)) {
            this.closeSearch();
        }
    }
}

// 确保DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 加载必要的库
    if (typeof Fuse === 'undefined') {
        const fuseScript = document.createElement('script');
        fuseScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/fuse.js/6.6.2/fuse.min.js';
        fuseScript.onload = () => {
            new HeaderSearch();
        };
        document.head.appendChild(fuseScript);
    } else {
        new HeaderSearch();
    }
});
