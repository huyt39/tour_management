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
    thumbs: {  //lien ket main va thumb
      swiper: imagesThumb,
    },
  });
// End Slider Tour Detail 

//in ra thong bao da them thanh cong
const alertAddCartSuccess=()=>{
    const elementAlert=document.querySelector("[alert-add-cart-success]");
    if(elementAlert){
        elementAlert.classList.remove("alert-hidden");
        setTimeout(()=>{
            elementAlert.classList.add("alert-hidden");
        },3000); //sau 3s thi add lai class

        const closeAlert=elementAlert.querySelector("[close-alert]");
        closeAlert.addEventListener("click",()=>{
            elementAlert.classList.add("alert-hidden");
        });
    }
}

//Carts
const cart = localStorage.getItem("cart"); //check xem co key "card" trong localStorage khong
if(!cart){ //neu chua co gio hang thi tao gio hang moi
    localStorage.setItem("cart",JSON.stringify([]));
}

//hien thi them so luong san pham vao mini-cart:
const showMiniCart=()=>{
    const miniCart=document.querySelector("[mini-cart]");
    if(miniCart){
        const cart = JSON.parse(localStorage.getItem("cart"));
        const totalQuantity=cart.reduce((sum, item)=>sum+item.quantity,0); //lap qua tung phan tu trong mang cart va tinh tong
        miniCart.innerHTML=totalQuantity; //gan quantity cho cart
    //sum ban dau duoc gan la 0, roi cong dan

    console.log(totalQuantity);
    }

}
showMiniCart();


//Them tour vao gio hang:
const formAddToCart=document.querySelector("[form-add-to-cart]");
if(formAddToCart){
    formAddToCart.addEventListener("submit", (event)=>{
        event.preventDefault(); //ngan chan hanh vi mac dinh la load lai trang khi submit
        
        const quantity=parseInt(event.target.elements.quantity.value); //chuyen chuoi thanh number
        const tourId=parseInt(formAddToCart.getAttribute("tour-id"));

        if(quantity>0 && tourId){ //neu so luong>0 va ton tai tourId moi cho dat hang
            const cart = JSON.parse(localStorage.getItem("cart"));

            //check xem tour da ton tai trong gio hang chua, de gop tour bi trung:
            const indexExistTour=cart.findIndex(item=>item.tourId==tourId); //tim ra vi tri tour da ton tai trong gio hang
            if(indexExistTour==-1){
                cart.push({ //add them phan tu
                    tourId: tourId,
                    quantity: quantity
                });
            }else{  //update phan tu
                cart[indexExistTour].quantity=cart[indexExistTour].quantity+quantity;
            }
            //luu vao local storage:
            localStorage.setItem("cart",JSON.stringify(cart)); //update item cart=gia tri cart moi
            alertAddCartSuccess();
            showMiniCart(); //update so luong ma ko can load lai trang
        }
    });
}
//End Carts

//Get data cart printout interface
const drawListTable = () => {
    const tableCart = document.querySelector("[table-cart]");
    if(tableCart){
        fetch('/cart/list-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: localStorage.getItem('cart')
            //Send API to backend
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
    };
    };
    //End Get data cart printout interface
    
    //Delete item
    const deleteItemInCart = () => {
        const buttonsDelete = document.querySelectorAll("[btn-delete]");
        if(buttonsDelete.length > 0) {
            buttonsDelete.forEach(button => {
                button.addEventListener("click", () => {
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
        //End delete item

        //Update quantity
const updateQuantityInCart = () => {
    const updateInputs = document.querySelectorAll('input[name="quantity"]');
    if(updateInputs.length > 0){
        updateInputs.forEach(input => {
            input.addEventListener("change", () => {
                const tourId = parseInt(input.getAttribute("item-id"));
                const quantity = parseInt(input.value);
                const cart = JSON.parse(localStorage.getItem('cart'));

                for (const item of cart) {
                    if(item.tourId === tourId)
                        item.quantity = quantity
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                drawListTable();
            });
        });
    }
}
//End update quantity

drawListTable();