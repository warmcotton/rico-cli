$(document).ready(function() {
    get(rest+itemRouter+parseUrl());
    $(".num-box").on("change", function() {
        let query = parseUrl();
        let full = location.href;
        if(query) {
            query = query.substr(0,query.lastIndexOf("&size="));
            query = query+"&size="+$(this).val();
        } else {
            query = "?search=&page=&size="+$(this).val();
        }
        full = full.replace(parseUrl(), '');
        location.href = full+query;
    })


});

const rest = "http://192.168.219.108:5050";
const itemRouter = "/itemsv2";

function get(path, method='GET') {
    $.ajax({
        type : method,
        url : path,
        contentType:'application/json',
        success : function(result, status, xhr) {
            printItems(result);
            changeSelect(result.size);
        },
        error : function(request, status, error) {
            alert("code:" + request.status + "  " + "error:" + error);
        }
    })
}

function parseUrl() {
    let url = location.href;
    return url.substring(url.indexOf("items")).replace('items','');
}

function printItems(result) {
    console.log(result);
    const size = result.size;
    const num = result.numberOfElements;
    const name = "addidas New Hammer sole for Sports person";
    const price = "$150.00";

    result.content.forEach(res => {
        create($("#product-wrapper"), res);
    });
}

function create(jq, res) {
    let singleProduct = 
    `<div class="col-lg-4 col-md-6">
        <div class="single-product">
            <a href="/item?itemid=`+res.id+`">
                <img class="img-fluid" src=`+'"'+rest+res.itemImgDtoList[0].imgUrl+'"'+`alt="">
            </a>
            <div class="product-details">
                <a href="/item?itemid=`+res.id+`">
                    <h6>`+res.name+`</h6>
                </a>
                <div class="price">
                    <h6> `+res.price+` 원</h6>
                    <h6 class="l-through">`+res.user+`</h6>
                </div>
                <div class="prd-bottom">
                    <a href="" class="social-info">
                        <span class="ti-bag"></span>
                        <p class="hover-text">add to bag</p>
                    </a>
                    <a href="" class="social-info">
                        <span class="lnr lnr-heart"></span>
                        <p class="hover-text">Wishlist</p>
                    </a>
                    <a href="" class="social-info">
                        <span class="lnr lnr-sync"></span>
                        <p class="hover-text">compare</p>
                    </a>
                    <a href="" class="social-info">
                        <span class="lnr lnr-move"></span>
                        <p class="hover-text">view more</p>
                    </a>
                </div>
            </div>
        </div>
    </div>`
    jq.append(singleProduct);
}

function changeSelect(size) {
    $('.num-box').val(size).niceSelect('update');
}