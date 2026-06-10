import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import About from './pages/About';
import Sales from './pages/Sales';
import ListProperty from './pages/ListProperty';
import Contact from './pages/Contact';
import PropertyDetail from './pages/PropertyDetail';
import AdminPanel from './admin/AdminPanel';

function PublicLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;
  return (
    <>
      <Header />
      <WhatsAppButton />
    </>
  );
}

function FooterLayout() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return <Footer />;
}

export default function App() {
  return (
    <BrowserRouter>
      <PublicLayout />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/vendas" element={<Sales />} />
        <Route path="/anuncie" element={<ListProperty />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/imovel/:id" element={<PropertyDetail />} />
        <Route path="/admin/*" element={<AdminPanel />} />
      </Routes>
      <FooterLayout />
    </BrowserRouter>
  );
}
