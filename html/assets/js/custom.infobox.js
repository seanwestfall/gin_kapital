function drawInfobox(infoboxContent, json, i){

    if( json.data[i].price )        { var price = '<div class="price average-color"><span>' + json.data[i].price + '</span></div>' }
        else                        { price = '' }
    if(json.data[i].id)             { var id = json.data[i].id }
        else                        { id = '' }
    if(json.data[i].url)            { var url = json.data[i].url }
        else                        { url = '' }
    if(json.data[i].type)           { var type = json.data[i].type }
        else                        { type = '' }
    if(json.data[i].title)          { var title = json.data[i].title }
        else                        { title = '' }
    if(json.data[i].location)       { var location = json.data[i].location }
        else                        { location = '' }
    if(json.data[i].gallery[0])     { var gallery = json.data[i].gallery[0] }
        else                        { gallery[0] = '../img/default-item.jpg' }

    var ibContent = '';
    ibContent =
    '<div class="infobox">' +
        '<div class="left">' +
            '<a href="'+ url +'" data-expand-width="col-9" data-transition-parent=".content-loader" data-external="true">' +
                '<div class="image">' +
                    price +
                    '<img src="'+ gallery +'" alt="">' +
                '</div>' +
                '<header class="average-color">' +
                    '<h1 class="animate move_from_top_short">'+ title +'</h1>' +
                    '<h2 class="animate move_from_top_short"><span>'+ location +'</span></h2>' +
                '</header>' +
            '</a>' +
        '</div>' +
        '<div class="right">' +
            '<article class="animate move_from_top_short">' +
                '<h3>Description</h3>' +
                '<p>Curabitur odio nibh, luctus non pulvinar a, ultricies ac diam. Donec neque massa, viverra interdum eros ut, imperdiet </p>' +
            '</article>' +
            '<article class="animate move_from_top_short">' +
                '<h3>Overview</h3>' +
                '<dl>' +
                    '<dt>Bathrooms</dt>' +
                    '<dd>1</dd>' +
                    '<dt>Bedrooms</dt>' +
                    '<dd>2</dd>' +
                    '<dt>Area</dt>' +
                    '<dd>165m<sup>2</sup></dd>' +
                    '<dt>Garages</dt>' +
                    '<dd>1</dd>' +
                '</dl>' +
            '</article>' +
        '</div>' +
    '</div>';

    return ibContent;
}