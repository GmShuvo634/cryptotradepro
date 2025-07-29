import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import PriceAlerts from "pages/price-alerts";
import MarketsOverview from "pages/markets-overview";
import TradingInterface from "pages/trading-interface";
import WalletManagement from "pages/wallet-management";
import PortfolioManagement from "pages/portfolio-management";
import NewsAnalysis from "pages/news-analysis";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<MarketsOverview />} />
        <Route path="/price-alerts" element={<PriceAlerts />} />
        <Route path="/markets-overview" element={<MarketsOverview />} />
        <Route path="/trading-interface" element={<TradingInterface />} />
        <Route path="/wallet-management" element={<WalletManagement />} />
        <Route path="/portfolio-management" element={<PortfolioManagement />} />
        <Route path="/news-analysis" element={<NewsAnalysis />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;