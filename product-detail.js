// 商品詳細ページの機能
class ProductDetail {
    constructor() {
        this.init();
    }

    init() {
        this.setupImageGallery();
        this.setupTabs();
        this.setupOptions();
        this.setupQuantitySelector();
        this.setupWishlist();
    }

    // 画像ギャラリーの設定
    setupImageGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('main-image');

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                // アクティブクラスの更新
                thumbnails.forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');

                // メイン画像の更新
                const newImageSrc = thumbnail.dataset.image;
                mainImage.src = newImageSrc;
                mainImage.alt = thumbnail.alt;

                // スムーズな切り替えアニメーション
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 150);
            });
        });

        // メイン画像のホバー効果
        if (mainImage) {
            mainImage.addEventListener('mouseenter', () => {
                mainImage.style.transform = 'scale(1.05)';
            });

            mainImage.addEventListener('mouseleave', () => {
                mainImage.style.transform = 'scale(1)';
            });
        }
    }

    // タブ機能の設定
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                // アクティブタブの更新
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // タブパネルの表示切り替え
                tabPanels.forEach(panel => {
                    if (panel.id === targetTab) {
                        panel.classList.add('active');
                        panel.style.display = 'block';
                    } else {
                        panel.classList.remove('active');
                        panel.style.display = 'none';
                    }
                });

                // スムーズな切り替えアニメーション
                const activePanel = document.getElementById(targetTab);
                if (activePanel) {
                    activePanel.style.opacity = '0';
                    setTimeout(() => {
                        activePanel.style.opacity = '1';
                    }, 50);
                }
            });
        });
    }

    // 商品オプションの設定
    setupOptions() {
        // カラー選択
        const colorOptions = document.querySelectorAll('input[name="color"]');
        colorOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateSelectedOptions();
            });
        });

        // サイズ選択
        const sizeOptions = document.querySelectorAll('input[name="size"]');
        sizeOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateSelectedOptions();
            });
        });
    }

    // 選択されたオプションの更新
    updateSelectedOptions() {
        const selectedColor = document.querySelector('input[name="color"]:checked');
        const selectedSize = document.querySelector('input[name="size"]:checked');

        // カートに追加ボタンのデータ属性を更新
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn && selectedColor && selectedSize) {
            addToCartBtn.dataset.selectedColor = selectedColor.value;
            addToCartBtn.dataset.selectedSize = selectedSize.value;
        }

        // 選択されたオプションの表示
        this.showSelectedOptions();
    }

    // 選択されたオプションの表示
    showSelectedOptions() {
        const selectedColor = document.querySelector('input[name="color"]:checked');
        const selectedSize = document.querySelector('input[name="size"]:checked');

        // 選択されたオプションのハイライト
        document.querySelectorAll('.color-option-large').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelectorAll('.size-option').forEach(option => {
            option.classList.remove('selected');
        });

        if (selectedColor) {
            const colorLabel = document.querySelector(`label[for="color-${selectedColor.value}"]`);
            if (colorLabel) colorLabel.classList.add('selected');
        }

        if (selectedSize) {
            const sizeLabel = document.querySelector(`label[for="size-${selectedSize.value}"]`);
            if (sizeLabel) sizeLabel.classList.add('selected');
        }
    }

    // 数量選択の設定
    setupQuantitySelector() {
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.addEventListener('change', () => {
                this.validateQuantity();
            });
        }
    }

    // 数量の変更
    changeQuantity(delta) {
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            let newQuantity = parseInt(quantityInput.value) + delta;
            newQuantity = Math.max(1, Math.min(10, newQuantity));
            quantityInput.value = newQuantity;
            this.validateQuantity();
        }
    }

    // 数量の検証
    validateQuantity() {
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            let value = parseInt(quantityInput.value);
            if (isNaN(value) || value < 1) {
                value = 1;
            } else if (value > 10) {
                value = 10;
            }
            quantityInput.value = value;
        }
    }

    // お気に入り機能の設定
    setupWishlist() {
        const wishlistBtn = document.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                this.toggleWishlist();
            });
        }
    }

    // お気に入りの切り替え
    toggleWishlist() {
        const wishlistBtn = document.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            const isWishlisted = wishlistBtn.classList.contains('wishlisted');

            if (isWishlisted) {
                wishlistBtn.classList.remove('wishlisted');
                wishlistBtn.textContent = '❤ お気に入り';
                this.showMessage('お気に入りから削除しました', 'info');
            } else {
                wishlistBtn.classList.add('wishlisted');
                wishlistBtn.textContent = '❤ お気に入り済み';
                this.showMessage('お気に入りに追加しました', 'success');
            }
        }
    }

    // メッセージ表示
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        // アニメーション
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 100);

        // 自動削除
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 3000);
    }

    // レビュー機能の設定
    setupReviews() {
        const writeReviewLink = document.querySelector('.write-review-link');
        if (writeReviewLink) {
            writeReviewLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showReviewForm();
            });
        }
    }

    // レビューフォームの表示
    showReviewForm() {
        const reviewForm = document.createElement('div');
        reviewForm.className = 'review-form-modal';
        reviewForm.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h3>レビューを書く</h3>
                <form class="review-form">
                    <div class="form-group">
                        <label>評価:</label>
                        <div class="rating-input">
                            <input type="radio" name="rating" id="rating-5" value="5" checked>
                            <label for="rating-5">★</label>
                            <input type="radio" name="rating" id="rating-4" value="4">
                            <label for="rating-4">★</label>
                            <input type="radio" name="rating" id="rating-3" value="3">
                            <label for="rating-3">★</label>
                            <input type="radio" name="rating" id="rating-2" value="2">
                            <label for="rating-2">★</label>
                            <input type="radio" name="rating" id="rating-1" value="1">
                            <label for="rating-1">★</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>タイトル:</label>
                        <input type="text" name="title" required maxlength="100">
                    </div>
                    <div class="form-group">
                        <label>レビュー:</label>
                        <textarea name="content" required maxlength="1000" rows="5"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.review-form-modal').remove()">キャンセル</button>
                        <button type="submit" class="btn btn-primary">投稿する</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(reviewForm);

        // フォームの送信処理
        const form = reviewForm.querySelector('.review-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReview(form);
            reviewForm.remove();
        });

        // 閉じるボタンの処理
        const closeBtn = reviewForm.querySelector('.modal-close');
        const overlay = reviewForm.querySelector('.modal-overlay');

        const closeModal = () => reviewForm.remove();
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }

    // レビューの投稿
    submitReview(form) {
        const formData = new FormData(form);
        const rating = formData.get('rating');
        const title = formData.get('title');
        const content = formData.get('content');

        // ここでレビューデータを処理（実際の実装ではAPIに送信）
        console.log('レビュー投稿:', { rating, title, content });

        this.showMessage('レビューを投稿しました。ありがとうございます！', 'success');

        // レビュータブに移動
        const reviewsTab = document.querySelector('[data-tab="reviews"]');
        if (reviewsTab) {
            reviewsTab.click();
        }
    }
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function () {
    new ProductDetail();
});

// グローバル関数（HTMLから直接呼び出し用）
function changeQuantity(delta) {
    const productDetail = document.querySelector('.product-detail') ? new ProductDetail() : null;
    if (productDetail) {
        productDetail.changeQuantity(delta);
    }
}
