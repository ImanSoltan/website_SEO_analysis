# Website SEO Analyzer

A web application designed to analyze the SEO health of any given website. It fetches website data, identifies common SEO issues, provides recommendations for improvement, and displays social media previews.

## Features

*   **SEO Score:** Get an overall SEO score based on various checks.
*   **Issue Detection:** Identifies common SEO problems such as:
    *   Missing or poorly optimized title tags
    *   Missing or poorly optimized meta descriptions
    *   Missing or incomplete Open Graph (Facebook, LinkedIn, etc.) meta tags
    *   Missing or incomplete Twitter Card meta tags
    *   Other common on-page SEO elements (keywords, canonical, robots, viewport, etc.)
*   **Recommendations:** Provides actionable advice to fix identified issues.
*   **Social Previews:** Shows how the website might appear when shared on:
    *   Google Search
    *   Facebook
    *   Twitter
*   **Responsive Design:** User-friendly interface that works on various screen sizes.
*   **Real-time Analysis:** Fetches and analyzes live website data.

## Tech Stack

*   **Frontend:**
    *   [React](https://reactjs.org/) (with Vite)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [React Icons](https://react-icons.github.io/react-icons/)
*   **HTTP Client:**
    *   [Axios](https://axios-http.com/)
*   **CORS Proxy:**
    *   Uses various public CORS proxies (e.g., allorigins.win, cors-anywhere) to fetch data from external websites.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (usually comes with Node.js) or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd website-seo-analysis-cursor
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install --legacy-peer-deps
    ```
    Or using yarn:
    ```bash
    yarn install --legacy-peer-deps 
    ```
    *(The `--legacy-peer-deps` flag might be needed due to some current dependency versioning in the project, as seen during setup.)*

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Or using yarn:
    ```bash
    yarn dev
    ```
    The application should now be running on `http://localhost:5173` (or the next available port).

## How to Use

1.  Open the application in your browser.
2.  Enter the full URL of the website you want to analyze (e.g., `https://example.com`) into the input field.
3.  Click the "Analyze" button.
4.  Review the SEO Health score, Key Insights, Issues to Address, and Recommendations provided.
5.  Check the Google, Facebook, and Twitter previews to see how the site might appear when shared.

## Screenshots

*(Consider adding a few screenshots of the application here once you're happy with the UI)*

*   *Main Analyzer Interface*
*   *Example of SEO Score and Issues*
*   *Example of Social Previews*

## Future Enhancements (Optional)

*   More detailed analysis for specific elements (e.g., heading structure, image alt tags).
*   Performance metrics (e.g., Lighthouse score integration).
*   Historical analysis and tracking.
*   User accounts and saved reports.

MIT License

Copyright (c) 2025 Iman Soltanzadeh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
