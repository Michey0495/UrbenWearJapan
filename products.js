// 商品一覧ページの機能
class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentSort = 'popular';
        this.currentPriceRange = 20000;
        this.currentSearch = '';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.applyFilters();
    }

    setupEventListeners() {
        // 検索機能
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // ソート機能
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }

        // 価格フィルター
        const priceRange = document.getElementById('price-range');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                this.currentPriceRange = parseInt(e.target.value);
                this.updatePriceDisplay();
                this.applyFilters();
            });
        }

        // クイックビューボタン
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-view-btn')) {
                this.showQuickView(e.target.closest('.product-card'));
            }
        });
    }

    loadProducts() {
        // 商品カードから商品情報を取得
        const productCards = document.querySelectorAll('.product-card');
        this.products = Array.from(productCards).map(card => ({
            element: card,
            id: card.dataset.productId,
            name: card.querySelector('.product-name').textContent,
            price: parseInt(card.dataset.price),
            category: card.dataset.category,
            rating: this.extractRating(card),
            reviewCount: this.extractReviewCount(card),
            isSale: card.querySelector('.product-badge.sale') !== null,
            isNew: card.querySelector('.product-badge.new') !== null,
            isPremium: card.querySelector('.product-badge.premium') !== null
        }));

        this.filteredProducts = [...this.products];
    }

    extractRating(card) {
        const stars = card.querySelector('.stars');
        if (stars) {
            return (stars.textContent.match(/★/g) || []).length;
        }
        return 0;
    }

    extractReviewCount(card) {
        const reviewCount = card.querySelector('.review-count');
        if (reviewCount) {
            const match = reviewCount.textContent.match(/\((\d+)件\)/);
            return match ? parseInt(match[1]) : 0;
        }
        return 0;
    }

    updatePriceDisplay() {
        const priceValue = document.getElementById('price-value');
        if (priceValue) {
            priceValue.textContent = `¥${this.currentPriceRange.toLocaleString()}以下`;
        }
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // 検索フィルター
            if (this.currentSearch && !product.name.toLowerCase().includes(this.currentSearch)) {
                return false;
            }

            // 価格フィルター
            if (product.price > this.currentPriceRange) {
                return false;
            }

            return true;
        });

        // ソート適用
        this.sortProducts();

        // 表示更新
        this.updateDisplay();
    }

    sortProducts() {
        switch (this.currentSort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'new':
                this.filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case 'popular':
            default:
                this.filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
                break;
        }
    }

    updateDisplay() {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        // 商品の表示/非表示を切り替え
        this.products.forEach(product => {
            const isVisible = this.filteredProducts.includes(product);
            product.element.style.display = isVisible ? 'block' : 'none';
        });

        // 結果件数表示
        this.updateResultCount();
    }

    updateResultCount() {
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            const existingCount = pageHeader.querySelector('.result-count');
            if (existingCount) {
                existingCount.remove();
            }

            const resultCount = document.createElement('div');
            resultCount.className = 'result-count';
            resultCount.textContent = `${this.filteredProducts.length}件の商品が見つかりました`;
            pageHeader.appendChild(resultCount);
        }
    }

    showQuickView(productCard) {
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productImage = productCard.querySelector('.product-image').src;

        // クイックビューモーダルを作成
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="quick-view-content">
                    <div class="quick-view-image">
                        <img src="${productImage}" alt="${productName}">
                    </div>
                    <div class="quick-view-info">
                        <h3>${productName}</h3>
                        <div class="quick-view-price">${productPrice}</div>
                        <div class="quick-view-description">
                            商品の詳細情報がここに表示されます。素材、サイズ、カラーなどの情報をご確認ください。
                        </div>
                        <div class="quick-view-actions">
                            <button class="btn btn-secondary">詳細を見る</button>
                            <button class="btn add-to-cart-btn">カートに入れる</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // モーダルを表示
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // 閉じるボタンのイベント
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.products-grid')) {
        new ProductManager();
    }
});

// ページネーション機能
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('page-link')) {
        e.preventDefault();

        // アクティブページの更新
        document.querySelectorAll('.page-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');

        // ここでページネーション処理を実装
        // 現在は単純なクリックイベントのみ
    }
});
