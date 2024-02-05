const rest = "http://192.168.219.108:5050";
const itemRouter = "/item";
const reivewRouter = "/reviews/"+parseUrl().replace("?itemid=","");

$(document).ready(function() {
    getItem(rest+itemRouter+parseUrl());
    getReview(rest+reivewRouter);

    $(".num-box").on("change", function() {
        //구매
    })

    $(".sort-box").on("change", function() {
        //카트담기
    })

    $("#submit_review").on("click", function() {
        const itemId = parseUrl().replace("?itemid=","");
        const review = $("#message").val();
        const rating = $("input[name='rating']:checked").val();
        
        if (review === "" || rating === undefined) {
            alert("Please fill in all the fields.");
        } else {
            submitReview(rest+"/review", {itemId:itemId, review:review, rating:rating});
        }
    });

    $(".sort-box").on("change", function() {
        //수량선택
    })



});

function parseUrl() {
    return location.search;
}

function getItem(path, method='GET') {
    $.ajax({
        type : method,
        url : path,
        contentType:'application/json',
        success : function(data, status, xhr) {
            printItemInfo(data);
        },
        error : function(xhr, status, error) {
            alert("error : "+xhr.status+"  "+xhr.responseText);
            location.href="/items"
        }
    })
}

function getReview(path, method='GET') {
    $.ajax({
        type : method,
        url : path,
        contentType:'application/json',
        success : function(data, status, xhr) {
            printReview(data);
        },
        error : function(xhr, status, error) {

        }
    })
}

function submitReview(path, params, method='POST') {
    const token = localStorage.getItem("accessToken");
    $.ajax({
        type: method,
        url: path,
        beforeSend : function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer "+token);
        },
        contentType: 'application/json',
        data: JSON.stringify(params), 
        success: function(data, status, xhr) {
            //redire
            console.log("Review submitted successfully");
        },
        error: function(xhr, status, error) {
            alert("error : "+xhr.status+"  "+xhr.responseText );
            if (xhr.responseText === "로그인이 필요합니다.") location.href="/login?path="+location.pathname+location.search;
        }
    });
}

function printReview(res) {
    if (res.length >=1 ) {
        res.forEach(res => {
            createReview($('.review_list'), res);
        });
    
        const avg = res.map(res => res.rating).reduce((a,b) => a+b) / res.length;
    
        $("#avg").text(avg.toFixed(1));
        $("#review_num").text("("+res.length+")"+ " Reviews");
    }
    
}

function createReview(parent, res) {
    const review = 
    `<div class="review_item">
        <div class="media">
            <div class="d-flex">
                <img src="/img/product/user-profile.png" alt="">
            </div>
            <div class="media-body">`+
                `<h4>`+res.name+`</h4>`+
                `<h5>`+res.dateTime+`</h5>`
                +star(res.rating)+
            `</div>
        </div>
        <p>`+res.review+`</p>
    </div>`

    parent.append(review);
}

function star(num) {
    let star = "";
    for(let i=0; i<num; i++) {
        star += `<i class="fa fa-star"></i>\n`
    }
    return star
}

function printItemInfo(res) {
    const images = res.itemImgDtoList.map(img=>`<div class="single-prd-item"><img class="img-fluid" src="`+rest+img.imgUrl+`" alt=""></div>`);
    const carousel = `<div class="s_Product_carousel">\n`+"  "+images.join('\n  ')+`\n</div>`
    const categories = res.category.map(ct => `<a href="/items/category?category=`+ct+`">`+ct+`   </a>`);
    const category = `<li><a class="active"><span>Category : </span>`+categories.join(' ')+`</a></li>`;
    const quantity = 
    `<div class="product_count"><label for="qty">Quantity:</label>
        <input type="text" name="qty" id="sst" maxlength="12" value="1" title="Quantity:" class="input-text qty" readonly>
        <button onclick="increase()" class="increase items-count" type="button"><i class="lnr lnr-chevron-up"></i></button>
        <button onclick="decrease()" class="reduced items-count" type="button"><i class="lnr lnr-chevron-down"></i></button>
    </div>`;
    const btn = 
    `<div class="card_area d-flex align-items-center">
        <a class="primary-btn" href="`+rest+"/addtoCart/"+res.id+`">장바구니 담기</a>
        <a class="buy-btn" href="`+rest+"/order/"+res.id+`">바로 주문</a>
        <a class="icon_btn" href="#"><i class="lnr lnr lnr-diamond"></i></a>
        <a class="icon_btn" href="#"><i class="lnr lnr lnr-heart"></i></a>
    </div>`;
    
    $("#carousel_wrapper").append(carousel);
    if(res.itemImgDtoList.length === 1) {
        $(".s_Product_carousel").append(`<div class="single-prd-item"><img class="img-fluid" src="`+rest+res.itemImgDtoList[0].imgUrl+`" alt=""></div>`);
    }
    
    $('.s_product_text').append(`<h3>`+res.name+`</h3>`);
    $('.s_product_text').append(`<h2>`+res.price+`원</h2>`);

    $('.s_product_text').append(`<ul class="list"></ul>`);
    $('.s_product_text').find('ul').append(category);
    $('.s_product_text').find('ul').append(`<li><a ><span>남은 수량 : </span>`+res.quantity+`</a></li>`);
    $('.s_product_text').append(`<p>`+res.brief+`</p>`);

    $('.s_product_text').append(quantity);
    $('.s_product_text').append(btn);

    $('#home').append(`<p>`+res.description+`</p>`)

    $(".s_Product_carousel").owlCarousel({
        items:1,
        autoplay:true,
        autoplayTimeout: 2000,
        loop:true,
        nav:false,
        dots:true
    });
}


function decrease() {
    let result = document.getElementById('sst'); 
    let sst = result.value; 
    if( sst > 1 ) result.value--;
    return false;
}

function increase() {
    let result = document.getElementById('sst'); 
    let sst = result.value; 
    if( sst < 50 ) result.value++;
    return false;
}