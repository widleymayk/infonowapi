// API Configuration
const API_KEY = 'YOUR_ABSTRACTAPI_KEY'; // Replace with your actual API key
const API_BASE_URL = 'https://holidays.abstractapi.com/v1/';

// DOM Elements
const countrySelect = document.getElementById('country-select');
const yearSelect = document.getElementById('year-select');
const searchBtn = document.getElementById('search-btn');
const holidayList = document.getElementById('holiday-list');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// Available countries (you can expand this list)
const countries = [
    { code: 'US', name: 'Estados Unidos' },
    { code: 'BR', name: 'Brasil' },
    { code: 'CA', name: 'Canadá' },
    { code: 'GB', name: 'Reino Unido' },
    { code: 'AU', name: 'Austrália' },
    { code: 'JP', name: 'Japão' },
    { code: 'DE', name: 'Alemanha' },
    { code: 'FR', name: 'França' },
    { code: 'IT', name: 'Itália' },
    { code: 'ES', name: 'Espanha' },
    { code: 'MX', name: 'México' },
    { code: 'AR', name: 'Argentina' }
];

// Initialize the application
function init() {
    populateCountrySelect();
    populateYearSelect();
    setupEventListeners();
    
    // Load default holidays (current year, first country in list)
    const currentYear = new Date().getFullYear();
    yearSelect.value = currentYear;
    if (countries.length > 0) {
        countrySelect.value = countries[0].code;
        fetchHolidays(countries[0].code, currentYear);
    }
}

// Populate country select dropdown
function populateCountrySelect() {
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });
}

// Populate year select dropdown (current year ± 5 years)
function populateYearSelect() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Set up event listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
}

// Handle search button click
function handleSearch() {
    const country = countrySelect.value;
    const year = yearSelect.value;
    
    if (!country || !year) {
        showError('Por favor, selecione um país e um ano.');
        return;
    }
    
    fetchHolidays(country, year);
}

// Fetch holidays from API
async function fetchHolidays(country, year) {
    showLoading();
    clearError();
    holidayList.innerHTML = '';
    
    try {
        const response = await fetch(`${API_BASE_URL}?api_key=${API_KEY}&country=${country}&year=${year}`);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        const holidays = await response.json();
        
        if (holidays.length === 0) {
            showError('Nenhum feriado encontrado para os critérios selecionados.');
            return;
        }
        
        displayHolidays(holidays);
    } catch (error) {
        console.error('Error fetching holidays:', error);
        showError('Falha ao carregar feriados. Por favor, tente novamente mais tarde.');
    } finally {
        hideLoading();
    }
}

// Display holidays in the panel
function displayHolidays(holidays) {
    holidays.forEach(holiday => {
        const holidayItem = createHolidayItem(holiday);
        holidayList.appendChild(holidayItem);
    });
}

// Create a holiday item element
function createHolidayItem(holiday) {
    const item = document.createElement('div');
    item.className = 'holiday-item';
    
    const name = document.createElement('div');
    name.className = 'holiday-name';
    name.textContent = holiday.name;
    
    const date = document.createElement('div');
    date.className = 'holiday-date';
    date.textContent = formatDate(holiday.date);
    
    const type = document.createElement('div');
    type.className = 'holiday-type';
    type.textContent = holiday.type.join(', ');
    
    item.appendChild(name);
    item.appendChild(date);
    item.appendChild(type);
    
    return item;
}

// Format date from YYYY-MM-DD to DD/MM/YYYY
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Show loading state
function showLoading() {
    loadingElement.style.display = 'flex';
}

// Hide loading state
function hideLoading() {
    loadingElement.style.display = 'none';
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Clear error message
function clearError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);