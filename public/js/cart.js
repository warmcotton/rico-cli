const rest = "http://192.168.219.108:8080";
const cartRouter = "/cart";

$(document).ready(function() {
    getCart(rest+cartRouter);
});

function getCart(path, method='GET') {
    const token = localStorage.getItem("accessToken");
    $.ajax({
        type: method,
        url: path,
        beforeSend : function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer "+token);
        },
        contentType: 'application/json',
        success: function(data, status, xhr) {
            createCartItem(data);
        },
        error: function(xhr, status, error) {
            alert("error : "+xhr.status+"  "+xhr.responseText );
            if (xhr.responseText === "로그인이 필요합니다.") location.href="/login?path="+location.pathname+location.search;
        }
    });
}

function createCartItem(data) {
    data.cartItemDto.forEach(item => {
        cartItem($('.table').find('tbody') ,item);
    });

    $('#totalPrice').text(data.cartItemDto.map(res => res.price * res.count).reduce(((a,b) => a+b))+" 원");
}

function cartItem(parent, cartItem) {
    const tr = 
    `
    <tr>
        <td>
            <div class="media">
                <div class="d-flex">
                    <img src="/img/cart.jpg" alt="">
                </div>
                <div class="media-body">
                    <p>`+cartItem.itemName+`</p>
                </div>
            </div>
        </td>
        <td class="price">
            <input type="hidden" value="`+cartItem.price+`">
            <h5>`+cartItem.price+` 원</h5>
        </td>
        <td>
            <div class="product_count">
                <input class="id" type="hidden" value="`+cartItem.id+`">
                <input class="count" type="Number" maxlength="12" value="`+cartItem.count+`" title="Quantity:"
                    class="input-text qty" readonly >
                <button onclick="increase(this)" class="increase items-count" type="button"><i class="lnr lnr-chevron-up"></i></button>
                <button onclick="decrease(this)" class="reduced items-count" type="button"><i class="lnr lnr-chevron-down"></i></button>
            </div>
        </td>
        <td class="total_item_price">
            <input type="hidden" value="`+cartItem.price*cartItem.count+`">
            <h5>`+cartItem.price*cartItem.count+` 원</h5>
        </td>
    </tr>
    `;
    parent.prepend(tr);
    
}

function increase(button) {
    const input = $(button).closest('.product_count').find('input[type="number"]');
    const id = $(button).closest('.product_count').find('input[type="hidden"]');
    let count = parseInt(input.val());

    if (count >= 50) {
        alert("최대 주문 수량 입니다")
        return;
    }
    if(!confirm("Are you sure?")) {
        return;
    }
    updateCartItem(rest+cartRouter, {cart_item_id:id.val(), count:count+1});
}


function decrease(button) {
    const input = $(button).closest('.product_count').find('input[type="number"]');
    const id = $(button).closest('.product_count').find('input[type="hidden"]');
    let count = parseInt(input.val());

    if(isNaN(count) || count <= 1) {
        return;
    }
    if(!confirm("Are you sure?")) {
        return;
    }

    updateCartItem(rest+cartRouter, {cart_item_id:id.val(), count:count-1});
}


function updateCartItem(path, params, method='PUT') {
    const token = localStorage.getItem("accessToken");

    $.ajax({
        type: method,
        url: path,
        beforeSend : function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer "+token);
        },
        data: JSON.stringify(params),
        contentType: 'application/json',
        success: function(data, status, xhr) {
            updateTag(data);
        },
        error: function(xhr, status, error) {
            alert("error : "+xhr.status+"  "+xhr.responseText );
            if (xhr.responseText === "로그인이 필요합니다.") location.href="/login?path="+location.pathname+location.search;
        }
    });
}

function updateTag(data) {
    console.log(data);
    const input = $('.id[value="'+data.id+'"]').closest('.product_count').find('input[type="number"]');
    const total = $('.id[value="'+data.id+'"]').closest('tr').find('.total_item_price');

    input.val(data.count);
    total.find('input').val(data.count*data.price);
    total.find('h5').text(data.count*data.price+" 원");

    let totalSum = 0;
    const sub_total = $('#totalPrice');
    $('.total_item_price input').each(function() {
        const inputValue = parseInt($(this).val());
        totalSum += inputValue;
    });;

    sub_total.text(totalSum+ " 원");
    
}