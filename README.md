# HentaiHeaven Scraper

HentaiHeaven Scraper is a versatile tool designed to gather Hentai information through searches or by utilizing popular pages such as trending and newly released content. While it does not directly extract stream links, it possesses the capability to fetch HentaiStream episode links, which can then be employed to retrieve the stream links from HentaiStream.

## Important Note

This is an REST API and Scraper created for educational purposes. Please do not abuse the uses of this or you might get banned

## How it Works

This scraper operates through the integration of three distinct modules for sending HTTP requests and parsing HTML:

- **Puppeteer:** Used for sending requests to websites with dynamically rendered HTML, functioning as a headless browser.

- **Cheerio:** Employed to parse HTML obtained through static HTTP requests made using Axios, extracting the specific data required.

- **Axios:** Facilitates sending static HTTP requests to the site, retrieving HTML data for further parsing with Cheerio.

## Key Features

- **Fast:** Optimized for efficient performance.
- **Low-sized:** Compact in size, minimizing resource utilization.

- **Easy to Use:** User-friendly interface for straightforward operation.

## License

This repository is licensed under the MIT License, making it an open-source project. Anyone is welcome to modify and enhance the code, creating their improved versions and subsequently publishing them.
