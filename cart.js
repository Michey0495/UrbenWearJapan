// カート機能の管理
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartDisplay();
        this.setupCartIconClick();
    }

    // カートアイコンのクリックイベントを設定
    setupCartIconClick() {
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }
    }

    // アイテムをカートに追加
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartMessage(product.name);
    }

    // アイテムの数量を変更
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    // アイテムを削除
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    // カートをクリア
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    // カートの合計金額を計算
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // カートのアイテム数を計算
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // カートをローカルストレージに保存
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // カートの表示を更新
    updateCartDisplay() {
        const cartIcon = document.getElementById('cart-icon');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');

        if (cartIcon && cartCount) {
            const itemCount = this.getItemCount();
            cartCount.textContent = itemCount;
            cartCount.style.display = itemCount > 0 ? 'block' : 'none';
        }

        if (cartTotal) {
            const total = this.getTotal();
            cartTotal.textContent = `¥${total.toLocaleString()}`;
        }
    }

    // カートページの表示を更新
    updateCartPage() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total-amount');

        if (cartItemsContainer) {
            if (this.items.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">カートにアイテムがありません</p>';
            } else {
                cartItemsContainer.innerHTML = this.items.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h3>${item.name}</h3>
                            <p class="cart-item-price">¥${item.price.toLocaleString()}</p>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <button class="remove-btn" onclick="cart.removeItem('${item.id}')">削除</button>
                    </div>
                `).join('');
            }
        }

        if (cartTotalElement) {
            const total = this.getTotal();
            cartTotalElement.textContent = `¥${total.toLocaleString()}`;
        }
    }

    // カートに追加したメッセージを表示
    showAddToCartMessage(productName) {
        const message = document.createElement('div');
        message.className = 'add-to-cart-message';
        message.textContent = `${productName} をカートに追加しました`;

        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// グローバルなカートインスタンスを作成
const cart = new Cart();

// ページ読み込み時にカートの表示を更新
document.addEventListener('DOMContentLoaded', function () {
    cart.updateCartDisplay();

    // カートページの場合、カートページの表示も更新
    if (window.location.pathname.includes('cart.html')) {
        cart.updateCartPage();
    }
});

// カートに追加ボタンのイベントリスナーを設定
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        let product;

        // 商品詳細ページの場合
        if (e.target.dataset.productId) {
            product = {
                id: e.target.dataset.productId,
                name: e.target.dataset.productName,
                price: parseInt(e.target.dataset.productPrice),
                image: e.target.dataset.productImage
            };
            
            // デバッグ用ログ
            console.log('商品詳細ページからカート追加:', product);
        } else {
            // 商品一覧ページの場合
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const priceElement = productCard.querySelector('.current-price');
                const priceText = priceElement ? priceElement.textContent : '';
                const price = parseInt(priceText.replace(/[^\d]/g, ''));
                
                product = {
                    id: productCard.dataset.productId || Date.now().toString(),
                    name: productCard.querySelector('.product-name').textContent,
                    price: price,
                    image: productCard.querySelector('.product-image').src
                };
                
                // デバッグ用ログ
                console.log('商品一覧ページからカート追加:', product);
            }
        }

        if (product) {
            console.log('カートに追加する商品:', product);
            cart.addItem(product);
        } else {
            console.error('商品情報の取得に失敗しました');
        }
    }
});
