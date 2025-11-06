# Weatherly

Weatherly is a weather app built with plain HTML, CSS and JavaScript. It resolves the user's location (via Geolocation + OpenCage), fetches weather data from Visual Crossing, and renders a clean UI with hourly and 7-day forecasts.

## Features

- Detects user location (Geolocation API) and resolves human-readable address via OpenCage.
- Fetches weather data from VisualCrossing and displays:
  - Current conditions (temperature, humidity, wind, pressure, visibility, feels-like, chance of rain)
  - Hourly forecast (next 24 hours)
  - 7-day forecast
- Light / dark theme toggle
- Search a city or location by name to get its weather data
- Simple toast notifications and Lucide icons

## Files and structure

```
index.html            # Main HTML
LICENSE               # Project license
assets/
	css/style.css       # Styles
	fonts/Roboto/       # Fonts used
	images/icons/       # Images & icons
js/
	app.js              # App logic (fetching, geolocation, event wiring)
	storage.js          # search history
	ui.js               # UI rendering helpers (renderNow, hourly, 7-day, toast, theme)
```

## Quick start (run locally)

Because this is a static site, you can open `index.html` directly in your browser for basic testing. For a more reliable dev environment (recommended), serve the folder over a local HTTP server to avoid any file-protocol edge cases.

PowerShell / Python (recommended):

```powershell
# from the project root
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Node (if you prefer http-server):

```powershell
npx http-server -c-1 -p 8000
# open http://localhost:8000
```

## Usage

- On load the app attempts to get your location. Allow location access to see weather for your current place.
- Use the search box to type a location name and press Enter to fetch weather for that place.
- Click the theme button to toggle light/dark mode.

## License

See the `LICENSE` file in the repository root for license details.