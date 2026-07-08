
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ProductContextWrapper from './context/ProductContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { CatalogProvider } from './context/CatalogContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <CatalogProvider>
  <ProductContextWrapper>
    <WishlistProvider>
      <App />
    </WishlistProvider>
    </ProductContextWrapper>
  </CatalogProvider>
  </BrowserRouter>,
)
