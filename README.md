# Currency Converter

A simple, responsive currency converter web application that allows users to convert between different currencies with real-time exchange rates.

## Features

- Convert between multiple currencies
- Display with country flags
- Responsive design for mobile and desktop
- Reverse currency direction with one click
- Real-time exchange rates (with API key)
- Fallback to simulated rates in demo mode


## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/2sipping0/currency-converter.git
   ```

2. Open `index.html` in your browser to use the app in demo mode.

3. To use real exchange rates:
   - Sign up for a free API key at [Exchange Rate API](https://www.exchangerate-api.com/)
   - Replace `'YOUR_API_KEY'` in script.js with your actual API key

## API Key Security

**IMPORTANT**: Never commit your API key to public repositories.

For personal use:
- Replace `'YOUR_API_KEY'` in the script.js file with your actual API key
- Keep in mind this is visible in client-side code

For production:
- Use environment variables
- Set up a proxy server to handle API requests
- Consider using a GitHub workflow with secrets

## Technologies Used

- HTML5
- CSS3 
- JavaScript (ES6+)
- [Tom Select](https://tom-select.js.org/) for enhanced dropdown menus
- [FlagCDN](https://flagcdn.com/) for country flags
- [Exchange Rate API](https://www.exchangerate-api.com/) for currency conversion rates

## License

MIT License - feel free to use and modify for your own projects.