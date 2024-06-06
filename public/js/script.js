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
        }
    });
}
//End Carts