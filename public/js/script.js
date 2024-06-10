// Slider Tour Detail 
var imagesThumb = new Swiper(".imagesThumb", {
    loop: true,
    spaceBetween: 10,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
});
var imagesMain = new Swiper(".imagesMain", {
    loop: true,
    spaceBetween: 10,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    thumbs: {  // liên kết main và thumb
        swiper: imagesThumb,
    },
});
// End Slider Tour Detail 

// In ra thông báo đã thêm thành công
const alertAddCartSuccess = () => {
    const elementAlert = document.querySelector("[alert-add-cart-success]");
    if (elementAlert) {
        elementAlert.classList.remove("alert-hidden");
        setTimeout(() => {
            elementAlert.classList.add("alert-hidden");
        }, 3000); // sau 3s thì add lại class

        const closeAlert = elementAlert.querySelector("[close-alert]");
        closeAlert.addEventListener("click", () => {
            elementAlert.classList.add("alert-hidden");
        });
    }
}

// Carts
const cart = localStorage.getItem("cart"); // check xem có key "card" trong localStorage không
if (!cart) { // nếu chưa có giỏ hàng thì tạo giỏ hàng mới
    localStorage.setItem("cart", JSON.stringify([]));
}

// Hiển thị thêm số lượng sản phẩm vào mini-cart:
const showMiniCart = () => {
    const miniCart = document.querySelector("[mini-cart]");
    if (miniCart) {
        const cart = JSON.parse(localStorage.getItem("cart"));
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0); // lặp qua từng phần tử trong mảng cart và tính tổng
        miniCart.innerHTML = totalQuantity; // gán quantity cho cart

        console.log(totalQuantity);
    }
}
showMiniCart();

// Thêm tour vào giỏ hàng:
const formAddToCart = document.querySelector("[form-add-to-cart]");
if (formAddToCart) {
    formAddToCart.addEventListener("submit", (event) => {
        event.preventDefault(); // ngăn chặn hành vi mặc định là load lại trang khi submit

        const quantity = parseInt(event.target.elements.quantity.value); // chuyển chuỗi thành number
        const tourId = parseInt(formAddToCart.getAttribute("tour-id"));

        if (quantity > 0 && tourId) { // nếu số lượng > 0 và tồn tại tourId mới cho đặt hàng
            const cart = JSON.parse(localStorage.getItem("cart"));

            // check xem tour đã tồn tại trong giỏ hàng chưa, để gộp tour bị trùng:
            const indexExistTour = cart.findIndex(item => item.tourId == tourId); // tìm ra vị trí tour đã tồn tại trong giỏ hàng
            if (indexExistTour == -1) {
                cart.push({ // thêm phần tử mới
                    tourId: tourId,
                    quantity: quantity
                });
            } else {  // cập nhật phần tử
                cart[indexExistTour].quantity = cart[indexExistTour].quantity + quantity;
            }
            // lưu vào local storage:
            localStorage.setItem("cart", JSON.stringify(cart)); // cập nhật item cart = giá trị cart mới
            alertAddCartSuccess();
            showMiniCart(); // cập nhật số lượng mà không cần load lại trang
        }
    });
}
// End Carts

// Get data cart printout interface
const drawListTable = () => {
    const tableCart = document.querySelector("[table-cart]");
    if (tableCart) {
        fetch('/cart/list-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: localStorage.getItem('cart')
            // Gửi API tới backend
        })
        .then(response => response.json())
        .then(data => {
            const tours = data.tours;
            const htmls = tours.map((item, index) => {
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <img src="${item.infoTour.images[0]}" alt="${item.infoTour.title}" width="80px">
                        </td>
                        <td>
                            <a href="/tours/detail/${item.infoTour.slug}">${item.infoTour.title}</a>
                        </td>
                        <td>${item.infoTour.price_special.toLocaleString()}đ</td>
                        <td>
                            <input type="number" name="quantity" value="${item.quantity}" min="1" item-id="${item.tourId}" style="width: 60px">
                        </td>
                        <td>${item.infoTour.total.toLocaleString()}đ</td>
                        <td>
                            <button class="btn btn-sm btn-danger" btn-delete="${item.tourId}">Xóa</button>
                        </td>
                    </tr>
                `;
            });

            const tbody = tableCart.querySelector("tbody");
            tbody.innerHTML = htmls.join("");

            // Tổng tiền
            const totalPrice = tours.reduce((sum, item) => sum + item.infoTour.total, 0);
            const elementTotalPrice = document.querySelector("[total-price]");
            elementTotalPrice.innerHTML = totalPrice.toLocaleString();

            deleteItemInCart();
            updateQuantityInCart();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
};
// End Get data cart printout interface

// Delete item
const deleteItemInCart = () => {
    console.log("deleteItemInCart called"); // Thêm dòng này để kiểm tra
    const buttonsDelete = document.querySelectorAll("[btn-delete]");
    console.log("buttonsDelete:", buttonsDelete); // Thêm dòng này để kiểm tra

    if (buttonsDelete.length > 0) {
        buttonsDelete.forEach(button => {
            button.addEventListener("click", () => {
                console.log("Delete button clicked"); // Thêm dòng này để kiểm tra
                const tourId = parseInt(button.getAttribute("btn-delete"));
                const cart = JSON.parse(localStorage.getItem('cart'));
                const newCart = cart.filter(item => item.tourId !== tourId);

                localStorage.setItem('cart', JSON.stringify(newCart));
                drawListTable();
                showMiniCart();
            });
        });
    }
}
// End delete item

// Update quantity
const updateQuantityInCart = () => {
    const updateInputs = document.querySelectorAll('input[name="quantity"]');
    if (updateInputs.length > 0) {
        updateInputs.forEach(input => {
            input.addEventListener("change", () => {
                const tourId = parseInt(input.getAttribute("item-id"));
                const quantity = parseInt(input.value);
                const cart = JSON.parse(localStorage.getItem('cart'));

                for (const item of cart) {
                    if (item.tourId === tourId) {
                        item.quantity = quantity;
                    }
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                drawListTable();
            });
        });
    }
}
// End update quantity

drawListTable();
