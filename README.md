# Stock Market Dashboard

A comprehensive stock market data visualization dashboard inspired by Screener.in, built with React, TypeScript, and Material UI.

## Features

### 1. Stock Overview Dashboard

- Homepage dashboard showing key market metrics
- Top gainers, losers, and most active stocks in separate tables
- Sector-wise performance visualization

### 2. Stock Detail Page

- Detailed view for individual stocks, Company information section
- Price chart with adjustable time periods (1D, 1W, 1M, 1Y, 5Y)
- Key financial ratios visualization (P/E, P/B, ROCE, etc.)
- Quarterly and annual financial performance trends

### 3. Stock Screener Tool

- Custom stock screener with multiple filter criteria
- Save and load filter configurations
- Export results as csv

### 4. Watchlist Management

- Create, read, update, and delete watchlists
- Drag-and-drop organization
- Performance metrics for watchlist items

### 5. Responsive Design

- Works well on desktop and mobile devices
- Appropriate layouts for different screen sizes (Mobile and Desktop)

## Tech Stack

- **Frontend**: React with TypeScript
- **State Management**: React Query for server state, Zustand for UI state
- **UI Library**: Material UI
- **Charting**: Recharts
- **Routing**: React Router
- **Form Validation**: Zod
- **Drag and Drop**: DND Kit
- **HTTP Client**: Axios
- **Date Handling**: Day.js

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/01abhay/temp-march
cd temp-march
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

### Docker Support

The project includes Docker configuration for easy deployment:

```bash
docker build -t stock-dashboard .
docker run -p 80:80 stock-dashboard
```

## Project Structure

```
src/
├── assets/         # Static assets like images
├── components/     # Reusable UI components
├── data/           # Mock data for development
├── pages/          # Page components
│   ├── Home/       # Dashboard page
│   ├── Screens/    # Stock screener page
│   ├── Stock/      # Stock details page
│   └── Watchlists/ # Watchlists page
├── routes/         # Routing configuration
├── services/       # API services
└── utils/          # Utility functions
```

## Design Decisions

- **Component Architecture**: Used a modular component approach for better maintainability and reusability
- **State Management**: Used React Query for server state and Zustand for UI state to optimize performance
- **Responsive Design**: Implemented responsive design using Material UI's Grid system
- **Error Handling**: Implemented proper error handling for API calls
- **Performance Optimization**: Used memoization and lazy loading where appropriate

## Future Improvements

- Add more advanced charting options
- Enhance mobile experience
- Implement unit and integration tests

## License

MIT
