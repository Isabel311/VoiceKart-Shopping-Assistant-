# Voicekart 🛒🎤

Voicekart is a Chrome extension that enables voice-powered product discovery and shopping assistance across multiple e-commerce platforms. Users can search for products using natural voice commands, compare shopping options, and save products to a custom Voicekart cart.

## Features

### 🎤 Voice Search

* Search products using speech recognition.
* Supports natural voice commands.
* Converts spoken queries into shopping searches.

### 🛍️ Multi-Store Shopping

Search products across:

* Amazon
* Flipkart
* Myntra

### 💰 Budget-Aware Search

Voice commands such as:

> "Search for headphones under 2000"

automatically detect budget constraints and generate relevant searches.

### 🛒 Voicekart Cart

* Add products directly from supported shopping websites.
* Save products using Chrome local storage.
* Access saved items later for comparison.

### 🔍 Product Comparison

* Compare products stored in the Voicekart cart.
* Compare shopping options across multiple stores.

### 🎨 Interactive Floating Widget

* Modern floating shopping assistant.
* Draggable interface.
* Quick access to search and comparison tools.

## Project Structure

```text
voice-shopping-extension/
├── manifest.json
├── content.js
├── popup.html
├── popup.js
├── logo.png
```

## Technologies Used

* JavaScript
* HTML5
* CSS3
* Chrome Extension Manifest V3
* Web Speech API
* Chrome Storage API

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/voice-shopping-extension.git
```

### 2. Load Extension in Chrome

1. Open Chrome.
2. Navigate to:

```text
chrome://extensions/
```

3. Enable **Developer Mode**.
4. Click **Load unpacked**.
5. Select the project folder.

## Usage

1. Open any supported shopping website.

2. Click the **🎤 Speak** button.

3. Say a product name, for example:

   * "Wireless headphones"
   * "Running shoes under 3000"
   * "Bluetooth speaker"

4. Voicekart generates shopping links and product suggestions.

5. Add products to the Voicekart cart for later comparison.

## Supported Websites

* Amazon
* Flipkart
* Myntra

## Future Enhancements

* AI-powered product recommendations
* Price tracking and alerts
* Voice-controlled checkout assistance
* Multi-language voice support
* Real-time price comparison APIs
* Personalized shopping insights

## License

MIT License

## Author

Developed as a voice-enabled shopping assistant browser extension project.
