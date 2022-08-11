let countries = [];
let storedCountries = [];

function checkSelect() {
    document.querySelector('.countries-select').onchange = e => {
        const value = e.currentTarget.value;
        const filteredCountries = countries.filter(country => country.region === value)
        renderCountries(filteredCountries.length ? filteredCountries : countries);
        storedCountries = filteredCountries;
        document.getElementById('search').value = '';
    }
}

function renderSelect(countries) {
    const uniqueRegions = countries.reduce((acc, country) => {
        if(!acc.includes(country.region)) {
            acc.push(country.region);
        }
        return acc;
    }, []);
    let htmlStr = `<option value="">Not Selected</option>`;
    htmlStr += uniqueRegions.map(region => `<option value="${region}">${region}</option>`).join('');

    let selectElement = document.createElement('select');
    selectElement.className = "countries-select form-control my-3";
    selectElement.innerHTML = htmlStr;
    document.querySelector('#search').before(selectElement);

    checkSelect();
}

function setListeners() {
    let tbody = document.querySelector('.table tbody');
    tbody.onclick = e => {
        for(let item of document.querySelectorAll('table tbody td')) {
            item.classList.remove('bg-warning');
        }
        e.target.classList.add('bg-warning');
    }
}

function sort() {
    for(let item of document.querySelectorAll('[data-attr]')) {
        item.onclick = event => {
            
            for(let i of document.querySelectorAll('table thead th i')) {
                i.parentNode.classList.remove('bg-warning');
                i.classList.add('d-none');
            }

            event.currentTarget.classList.add('bg-warning');
            let key = event.currentTarget.getAttribute('data-attr');
            let isSorted = event.currentTarget.getAttribute('data-sorted');
            let sortedCountries = countries.sort((a, b) => {
                if(isSorted){
                    return a[key] > b[key] ? -1 : 1;
                }
                return a[key] > b[key] ? 1 : -1;
            });

            if(isSorted) {
                event.currentTarget.removeAttribute('data-sorted');
                event.currentTarget.querySelector('.fa-arrow-down').classList.remove('d-none');
            } else {
                event.currentTarget.setAttribute('data-sorted', '+');
                event.currentTarget.querySelector('.fa-arrow-up').classList.remove('d-none');
            }
            renderCountries(sortedCountries);
        }
    }
}

function renderCountries(countries) {
    const htmlStr = countries.reduce((acc, country, index) => {
        let {name, capital, area, region} = country;
        return acc + `<tr>
                    <td>${index + 1}</td>
                    <td>${name}</td>
                    <td>${capital || '---'}</td>
                    <td>${region}</td>
                    <td>${area}</td>
                </tr>`;
    }, '');
    document.querySelector('.table tbody').innerHTML = htmlStr;
    setListeners();
    sort();
}

document.getElementById('search').onkeyup = e => {
    let searchValue = e.currentTarget.value.toLowerCase().trim();
    const filteredCountries = (storedCountries.length ? storedCountries : countries)
        .filter(country => {
            let {name, capital, region} = country;
        return name.toLowerCase().includes(searchValue)
            || capital.toLowerCase().includes(searchValue)
            || region.toLowerCase().includes(searchValue);
    })
    renderCountries(filteredCountries);
}


document.querySelector('.google-link').onclick = e => {
    let value = confirm('You are going to leave the page. Are you sure?');
    if(!value) {
        e.preventDefault();
    }
}

document.querySelector('.load-countries-btn').onclick = () => {
    document.querySelector('.load-countries button').setAttribute('disabled', '');
    fetch('https://restcountries.com/v2/all').then(data => data.json()).then(data => {
        console.log(data);
        document.querySelector('.load-countries button').removeAttribute('disabled');
        countries = data.map(country => {
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