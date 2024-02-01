$(document).ready(function() {
    get(rest+itemRouter+parseUrl());

    const {search, page, size, sort} = getQuery();

    $(".num-box").on("change", function() {
        const size = $(this).val();

        const query = "?search="+search+"&page="+
        0+"&size="+size+"&sort="+sort;
        location.href = location.origin+"/items"+query;
    })

    $(".sort-box").on("change", function() {
        const sort = $(this).val();

        const query = "?search="+search+"&page="+
        0+"&size="+size+"&sort="+sort;
        location.href = location.origin+"/items"+query;
    })

    

    $(".pagination").find('a').on("click", function() {
        console.log($(this));
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
            changeSelect(result);
            changePage(result);
        },
        error : function(request, status, error) {
            alert("code:" + request.status + "  " + "error:" + error);
            // location.href="/"
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

function changeSelect(res) {
    $('.num-box').val(res.size).niceSelect('update');
    //$('.sort-box').val(size).niceSelect('update');
}

function changePage(result) {
    const max = result.totalPages;
    const totalElements = result.totalElements;
    const totalPages = result.totalPages;
    const pageSize = result.size;
    const current = result.pageable.pageNumber;
    const elements = result.numberOfElements
    const offset = result.pageable.offset;
    const query = getQuery();
    console.log(getQuery());

    if (offset != 0 ) {
        const path = updatePageurl(current-1, query);
        $('.pagination').append(`<a href="`+path+`" class="prev-arrow"><i class="fa fa-long-arrow-left" aria-hidden="true"></i></a>`);
    } 

    for(let p=0; p < totalPages; p++ ) {
        if (current-2 <= p && p <= current+2) {
            const path = updatePageurl(p, query);
            if(current === p) {
                $('.pagination').append(`<a href="`+path+`" class="active">`+(p+1)+`</a>`);
            } else {
                $('.pagination').append(`<a href="`+path+`" >`+(p+1)+`</a>`);
            }
        }
    }

    if (offset + pageSize < totalElements ) {
        const path = updatePageurl(current+1, query);
        $('.pagination').append(`<a href="`+path+`" class="next-arrow"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>`);
    }
}

function updatePageurl(page_, query) {
    const {search, page, size, sort} = query;
    const qp = "?search="+search+"&page="+page_+"&size="+size+"&sort="+sort;

    return location.origin+"/items"+qp;
}


function getQuery() {
    const parameters = {};
    let query = location.search;
    if (query.indexOf('?')!== -1) {
        query = query.replace('?','');
    }
    query.split('&')
    .forEach(res => parameters[res.split('=')[0]]=res.split('=')[1]);

    const search = parameters.search ?? "";
    const page = parameters.page ?? "";
    const size = parameters.size ?? "";
    const sort = parameters.sort ?? "";

    return {search, page, size, sort};
}