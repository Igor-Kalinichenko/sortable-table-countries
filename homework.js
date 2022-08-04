let countries = [];
let storedCountries = [];

function checkSelect() {
    document.querySelector('.countries-select').onchange = function(e) {
        const value = e.currentTarget.value;
        const filteredCountries = countries.filter(function(country) {
            return country.region === value;
        })
        renderCountries(filteredCountries.length ? filteredCountries : countries);
        storedCountries = filteredCountries;
        document.getElementById('search').value = '';
    }
}

function renderSelect(countries) {
    const uniqueRegions = countries.reduce(function(acc, country) {
        if(!acc.includes(country.region)) {
            acc.push(country.region);
        }
        return acc;
    }, []);
    let htmlStr = `<option value="">Not Selected</option>`;
    htmlStr += uniqueRegions.map(function(region) {
        return `<option value="${region}">${region}</option>`;
    }).join('');

    let selectElement = document.createElement('select');
    selectElement.className = "countries-select form-control my-3";
    selectElement.innerHTML = htmlStr;
    document.querySelector('#search').before(selectElement);

    checkSelect();
}

function setListeners() {
    let tbody = document.querySelector('.table tbody');
    tbody.onclick = function(e) {
        for(let item of document.querySelectorAll('table tbody td')) {
            item.classList.remove('bg-warning');
        }
        e.target.classList.add('bg-warning');
    }
}

function sort() {
    for(let item of document.querySelectorAll('[data-attr]')) {
        item.onclick = function(event) {
            let key = event.currentTarget.getAttribute('data-attr');
            let isSorted = event.currentTarget.getAttribute('data-sorted');
            let sortedCountries = countries.sort(function(a, b) {
                if(isSorted){
                    return a[key] > b[key] ? -1 : 1;
                }
                return a[key] > b[key] ? 1 : -1;
            });

            if(isSorted) {
                event.currentTarget.removeAttribute('data-sorted');
            } else {
                event.currentTarget.setAttribute('data-sorted', '+');
            }
            renderCountries(sortedCountries);
        }
    }
}

function renderCountries(countries) {
    const htmlStr = countries.reduce(function(acc, country, index) {
        return acc + `<tr>
                    <td>${index + 1}</td>
                    <td>${country.name}</td>
                    <td>${country.capital || '---'}</td>
                    <td>${country.region}</td>
                    <td>${country.area}</td>
                </tr>`;
    }, '');
    document.querySelector('.table tbody').innerHTML = htmlStr;
    setListeners();
    sort();
}

document.getElementById('search').onkeyup = function(e) {
    let searchValue = e.currentTarget.value.toLowerCase().trim();
    const filteredCountries = (storedCountries.length ? storedCountries : countries)
        .filter(function(country) {
        const name = country.name.toLowerCase();
        const capital = country.capital.toLowerCase();
        const region = country.region.toLowerCase();
        return name.includes(searchValue)
            || capital.includes(searchValue)
            || region.includes(searchValue);
    })
    renderCountries(filteredCountries);
    // document.querySelector('.countries-select').value = '';
}


document.querySelector('.google-link').onclick = function(e) {
    let value = confirm('You are going to leave the page. Are you sure?');
    if(!value) {
        e.preventDefault();
    }
}

document.querySelector('.load-countries-btn').onclick = function() {
    document.querySelector('.load-countries button').setAttribute('disabled', '');
    fetch('https://restcountries.com/v2/all').then(function (data){
        return data.json();
    }).then(function(data) {
        document.querySelector('.load-countries button').removeAttribute('disabled');
        countries = data.map(function(country) {
            return {
                name: country.name,
                capital: country.capital || '',
                area: country.area || 0,
                region: country.region
            };
        });
        const countriesSelect = document.querySelector('.countries-select');
        if(countriesSelect?.innerHTML) {
            countriesSelect.remove();
        }
        renderCountries(countries);
        renderSelect(countries);
    })
}