import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Package, ArrowLeft, Filter, DollarSign, Hash } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { useConfirmation } from '../hooks/useConfirmation';
import { productsAPI } from '../services/api';
import ProductForm from '../components/ProductForm';
import Header from '../components/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { LoadingCard } from '../components/ui/Loading';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import SkipLink from '../components/ui/SkipLink';
import SearchBar from '../components/ui/SearchBar';
import FilterModal from '../components/ui/FilterModal';
import SortableTableHeader from '../components/ui/SortableTableHeader';

const Produtos = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'asc' });

  const { t } = useTranslation();
  const { success, error } = useNotification();
  const { 
    confirmationState, 
    hideConfirmation, 
    confirmDelete, 
    confirmUpdate,
    setLoading: setConfirmationLoading 
  } = useConfirmation();

  // Filtrar e ordenar produtos
  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // Aplicar filtros de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.nome.toLowerCase().includes(searchLower) ||
        product.descricao?.toLowerCase().includes(searchLower) ||
        product.id.toString().includes(searchLower)
      );
    }

    // Aplicar filtros avançados
    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined) {
        result = result.filter(product => product.valor >= parseFloat(filters.priceRange.min));
      }
      if (filters.priceRange.max !== undefined) {
        result = result.filter(product => product.valor <= parseFloat(filters.priceRange.max));
      }
    }

    // Ordenação
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Tratar strings
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [products, searchTerm, filters, sortConfig]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (err) {
      error(t('errors.network'), {
        title: t('errors.generic')
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreateProduct = async (productData) => {
    try {
      await productsAPI.create(productData);
      setShowForm(false);
      loadProducts();
      success(t('products.product_added'), {
        title: t('common.success')
      });
    } catch (err) {
      error(t('errors.generic'), {
        title: t('common.error')
      });
    }
  };

  const handleUpdateProduct = async (productData) => {
    const confirmed = await confirmUpdate(editingProduct.nome);
    if (!confirmed) return;

    setConfirmationLoading(true);
    try {
      await productsAPI.update(editingProduct.id, productData);
      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
      success(t('products.product_updated'), {
        title: t('common.success')
      });
    } catch (err) {
      error(t('errors.generic'), {
        title: t('common.error')
      });
    } finally {
      hideConfirmation();
      setConfirmationLoading(false);
    }
  };

  const handleSort = (sortData) => {
    setSortConfig(sortData);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const filterOptions = {
    priceRange: {
      type: 'range',
      label: t('products.price_range')
    }
  };

  const handleDeleteProduct = async (product) => {
    
    const confirmed = await confirmDelete(product.nome);
    if (!confirmed) return;

    setConfirmationLoading(true);
    try {
      await productsAPI.delete(product.id);
      loadProducts();
      success(t('products.product_deleted'), {
        title: t('common.success')
      });
    } catch (err) {
      error(t('errors.generic'), {
        title: t('common.error')
      });
    } finally {
      hideConfirmation();
      setConfirmationLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <>
      <SkipLink />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header 
          title={t('auth.system_title')} 
          onLogout={handleLogout} 
        />

        <main id="main-content" className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8" tabIndex="-1">
          {!showForm ? (
            <div className="space-y-6 sm:space-y-8">
              {/* Header Section */}
              <header className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('products.title')}</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {t('products.no_products_description')}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Search Bar */}
                  <div className="w-full sm:w-80">
                    <SearchBar
                      placeholder={t('products.search_products')}
                      value={searchTerm}
                      onChange={setSearchTerm}
                      onClear={() => setSearchTerm('')}
                    />
                  </div>
                  
                  {/* Filters Button */}
                  <Button
                    onClick={() => setShowFilterModal(true)}
                    variant="secondary"
                    size="lg"
                    aria-label={t('common.filters')}
                    className="whitespace-nowrap"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    {t('common.filters')}
                    {Object.keys(filters).length > 0 && (
                      <Badge variant="primary" className="ml-2">
                        {Object.keys(filters).length}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => setShowForm(true)}
                    size="lg"
                    aria-label={t('products.add_product')}
                    icon={<Plus className="w-5 h-5" />}
                    className="whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">{t('products.add_product')}</span>
                    <span className="sm:hidden">{t('common.add')}</span>
                  </Button>
                </div>
              </header>

              {/* Stats Cards */}
              <section aria-label="Estatísticas dos produtos">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <Card hover className="text-center p-4 sm:p-6">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">{filteredAndSortedProducts.length}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">{t('products.total_products')}</div>
                  </Card>
                  
                  <Card hover className="text-center p-4 sm:p-6">
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">
                      R$ {products.reduce((sum, p) => sum + p.valor, 0).toFixed(2)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">{t('products.total_value')}</div>
                  </Card>
                  
                  <Card hover className="text-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                      R$ {products.length > 0 ? (products.reduce((sum, p) => sum + p.valor, 0) / products.length).toFixed(2) : '0.00'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">{t('products.average_price')}</div>
                  </Card>
                </div>
              </section>

              {/* Products List */}
              <section aria-label={t('products.title')}>
                <Card className="overflow-hidden">
                  {isLoading ? (
                    <LoadingCard title={t('accessibility.loading_content')} />
                  ) : filteredAndSortedProducts.length === 0 ? (
                    <EmptyState
                      icon={<Package className="w-16 h-16 text-gray-300" />}
                      title={searchTerm ? 'Nenhum produto encontrado' : t('products.no_products')}
                      description={searchTerm ? 'Tente ajustar sua pesquisa' : t('products.no_products_description')}
                      action={
                        searchTerm ? (
                          <Button onClick={() => setSearchTerm('')} size="lg" variant="outline">
                            Limpar pesquisa
                          </Button>
                        ) : (
                          <Button onClick={() => setShowForm(true)} size="lg">
                            {t('products.add_product')}
                          </Button>
                        )
                      }
                    />
                  ) : (
                    <>
                      {/* Desktop Table */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200" role="table" aria-label={t('products.title')}>
                          <thead className="bg-gray-50">
                            <tr>
                              <SortableTableHeader 
                                sortKey="nome"
                                currentSort={sortConfig}
                                onSort={handleSort}
                                icon={<Package className="h-4 w-4" />}
                              >
                                {t('products.product_name')}
                              </SortableTableHeader>
                              <SortableTableHeader 
                                sortKey="descricao"
                                currentSort={sortConfig}
                                onSort={handleSort}
                              >
                                {t('products.description')}
                              </SortableTableHeader>
                              <SortableTableHeader 
                                sortKey="preco"
                                currentSort={sortConfig}
                                onSort={handleSort}
                                icon={<DollarSign className="h-4 w-4" />}
                              >
                                {t('products.price')}
                              </SortableTableHeader>
                              <th 
                                scope="col"
                                className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {t('common.actions')}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAndSortedProducts.map((product) => (
                              <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <div 
                                      className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-4"
                                      aria-hidden="true"
                                    >
                                      {product.nome.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {product.nome}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        ID: {product.id}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900 max-w-xs truncate">
                                    {product.descricao || (
                                      <span className="text-gray-400 italic">Sem descrição</span>
                                    )}
                                  </div>
                                </td>
                                
                                <td className="px-6 py-4">
                                  <Badge variant="primary" size="md">
                                    R$ {product.valor.toFixed(2)}
                                  </Badge>
                                </td>
                                
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2" role="group" aria-label={`Ações para ${product.nome}`}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditProduct(product)}
                                      aria-label={`${t('common.edit')} ${product.nome}`}
                                      icon={<Edit className="w-4 h-4" />}
                                    >
                                      {t('common.edit')}
                                    </Button>
                                    
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteProduct(product)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      aria-label={`${t('common.delete')} ${product.nome}`}
                                      icon={<Trash2 className="w-4 h-4" />}
                                    >
                                      {t('common.delete')}
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden space-y-4 p-4">
                        {filteredAndSortedProducts.map((product) => (
                          <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3 flex-1">
                                <div 
                                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold"
                                  aria-hidden="true"
                                >
                                  {product.nome.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {product.nome}
                                  </h3>
                                  <p className="text-xs text-gray-500">ID: {product.id}</p>
                                  {product.descricao && (
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                      {product.descricao}
                                    </p>
                                  )}
                                  <div className="mt-2 flex items-center gap-2">
                                    <Badge variant="primary" size="sm">
                                      R$ {product.valor.toFixed(2)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2 ml-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                  aria-label={`${t('common.edit')} ${product.nome}`}
                                  icon={<Edit className="w-4 h-4" />}
                                  className="p-2"
                                />
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                  aria-label={`${t('common.delete')} ${product.nome}`}
                                  icon={<Trash2 className="w-4 h-4" />}
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </Card>
              </section>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <header className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={handleCancelForm}
                  aria-label={t('common.back')}
                  icon={<ArrowLeft className="w-5 h-5" />}
                >
                  <span className="hidden sm:inline">{t('common.back')}</span>
                </Button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {editingProduct ? t('products.edit_product') : t('products.add_product')}
                  </h1>
                </div>
              </header>

              <ProductForm
                product={editingProduct}
                onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
                onCancel={handleCancelForm}
              />
            </div>
          )}
        </main>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationState.isOpen}
          onClose={hideConfirmation}
          onConfirm={confirmationState.onConfirm}
          title={confirmationState.title}
          message={confirmationState.message}
          type={confirmationState.type}
          confirmText={confirmationState.confirmText}
          cancelText={confirmationState.cancelText}
          requireTyping={confirmationState.requireTyping}
          typingText={confirmationState.typingText}
          loading={confirmationState.loading}
        />

        {/* Filter Modal */}
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          filters={filters}
          filterOptions={filterOptions}
        />
      </div>
    </>
  );
};

export default Produtos;
