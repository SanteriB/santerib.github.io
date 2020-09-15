const tree = {
    'country': {
        'fieldname': 'Страна',
        'name': 'city',
        'url': 'json/cities.json',
        'filterParameter': false
    },
    'city': {
        'fieldname': 'Город',
        'name': 'airport',
        'url': 'json/airports.json',
        'filterParameter': 'country_code'
    },
    'airport': {
        'fieldname': 'Aэропорт',
        'name': false,
        'url': false,
        'filterParameter': 'city_code'
    },
};

function app() {

    getFormField({
        url: 'json/countries.json',
        method: 'GET',
        container: document.querySelector('#form-airport'),
        id: 'country',
        fieldname: 'Страна',
        childData: tree['country'],
        filterParameter: false
    });
}

function getFormField(params) {
    try {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(xhttp.responseText);
                const field = document.createElement('div');
                const label = document.createElement('label');
                const select = document.createElement('select');
                const emptyOption = document.createElement('option');

                setAttributes(field, {
                    'class': 'form-field'
                });
                setAttributes(label, {
                    'class': 'form-label', 
                    'for': params.id
                });
                setAttributes(select, {
                    'class': 'form-input form-input-select', 
                    'id': params.id, 
                    'name': params.id
                });
                setAttributes(emptyOption, {
                    'selected': true,
                    'disabled': true
                });

                emptyOption.appendChild(document.createTextNode('выберите значение...'));
                select.appendChild(emptyOption);

                response.forEach(item => {
                    if (params.filterParameter) {
                        if ((params.filterParameter == item[params.childData.filterParameter]) && item.name) {
                            const option = document.createElement('option');
                            setAttributes(option, {
                                'value': item.code
                            });
        
                            option.appendChild(document.createTextNode(item.name));
                            select.appendChild(option);
                        }
                    } else {
                        const option = document.createElement('option');
                        setAttributes(option, {
                            'value': item.code
                        });
    
                        option.appendChild(document.createTextNode(item.name));
                        select.appendChild(option);
                    }
                });

                label.appendChild(document.createTextNode(params.fieldname));
                field.appendChild(label);
                field.appendChild(select);
                params.container.appendChild(field);

                select.addEventListener('change', item => {
                    if (document.querySelector('.airport-info')) {
                        document.querySelector('.airport-info').remove();
                    }                    
                    removeNextSiblings({
                        element: item.target.parentElement,
                        class: 'form-field'
                    });
                    if (params.childData.url) {
                        getFormField({
                            url: params.childData.url,
                            method: params.method,
                            container: params.container,
                            id: params.childData.name,
                            fieldname: tree[params.childData.name].fieldname,
                            childData: tree[params.childData.name],
                            filterParameter: item.target.value
                        });
                    } else {
                        showAirportData({
                            childData: params.childData,
                            filterParameter: item.target.value,
                            data: response
                        });
                    }
                });

                if (!params.childData.url) {
                    showAirportData({
                        childData: params.childData,
                        filterParameter: select.value,
                        data: response
                    });
                }
            }
        };
        xhttp.open(params.method, params.url, true);
        xhttp.send();
    } catch(error) {
        throw error;
    }
}

function setAttributes(element, attributes) {
    for(var key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function removeNextSiblings(elementData) {  
    let sibling = elementData.element.nextSibling;

    if ((sibling) && (sibling.nodeName != '#text')) {
        if (sibling.hasAttribute('class', elementData.class)) {
            sibling.remove();
            removeNextSiblings(elementData);        
        }
    }    
}

function showAirportData(params) {
    if (params.data) {
        params.data.forEach(item => {
            if (params.filterParameter == item.code) {                
                if (document.querySelector('.airport-info')) {
                    document.querySelector('.airport-info').remove();
                }                    

                const airport = document.createElement('div');
                const name = document.createElement('h2');
                const info = document.createElement('div');
                const flightable = item.flightable ? 'Да' : 'Нет';
                const time = new Date().toLocaleString("ru-RU", {timeZone: item.time_zone}).split(',');
                const content = `Действующий: ${flightable}<br>
                                 Код ИАТА: ${item.code}<br>
                                 Местное время: ${time[1]} (${time[0]})`;

                setAttributes(airport, {
                    'class': 'airport-info'
                });

                setAttributes(name, {
                    'class': 'airport-info-title'
                });

                setAttributes(info, {
                    'class': 'airport-info-content'
                });

                name.appendChild(document.createTextNode(item.name));
                info.insertAdjacentHTML('beforeend', content);
                airport.appendChild(name);
                airport.appendChild(info);

                document.querySelector('#form-airport').after(airport);
            }
        });        
    }
}

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(app);