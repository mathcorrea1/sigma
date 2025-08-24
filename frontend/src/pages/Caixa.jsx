import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, Package, Hash, X, Trash2, Filter, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { caixaAPI, productsAPI } from '../services/api';
import SkipLink from '../components/ui/SkipLink';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import Loading from '../components/ui/Loading';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import FilterModal from '../components/ui/FilterModal';
import SortableTableHeader from '../components/ui/SortableTableHeader';
import { useNotification } from '../contexts/NotificationContext';
import { useConfirmation } from '../hooks/useConfirmation';

const Caixa = () => {
  const [caixaData, setCaixaData] = useState({
    movimentacoes: [],
    total_entradas: 0,
    total_saidas: 0,
    saldo_atual: 0
  });
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'data_movimentacao', direction: 'desc' });
  const [formData, setFormData] = useState({
    produto_id: '',
    quantidade: '',
    tipo: 'entrada',
    valor_total: ''
  });

  const { t } = useTranslation();
  const { success, error } = useNotification();
  const {
    confirmationState,
    showConfirmation,
    hideConfirmation,
    confirmDelete
  } = useConfirmation();

  // Filtrar e ordenar movimentações
  const filteredAndSortedMovimentacoes = useMemo(() => {
    let result = caixaData.movimentacoes;

    // Aplicar filtros de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(mov => 
        (mov.produto?.nome || mov.produto_nome || '').toLowerCase().includes(searchLower) ||
        mov.tipo.toLowerCase().includes(searchLower) ||
        mov.id.toString().includes(searchLower)
      );
    }

    // Aplicar filtros avançados
    if (filters.tipo) {
      result = result.filter(mov => mov.tipo === filters.tipo);
    }

    if (filters.dateRange) {
      if (filters.dateRange.start) {
        result = result.filter(mov => 
          new Date(mov.data_movimentacao) >= new Date(filters.dateRange.start)
        );
      }
      if (filters.dateRange.end) {
        result = result.filter(mov => 
          new Date(mov.data_movimentacao) <= new Date(filters.dateRange.end)
        );
      }
    }

    if (filters.valueRange) {
      if (filters.valueRange.min !== undefined) {
        result = result.filter(mov => mov.valor_total >= parseFloat(filters.valueRange.min));
      }
      if (filters.valueRange.max !== undefined) {
        result = result.filter(mov => mov.valor_total <= parseFloat(filters.valueRange.max));
      }
    }

    // Ordenação
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Tratar datas
        if (sortConfig.key === 'data_movimentacao') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

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
  }, [caixaData.movimentacoes, searchTerm, filters, sortConfig]);

  const loadCaixaData = async () => {
    setIsLoading(true);
    try {
      const data = await caixaAPI.getMovimentacoes();
      setCaixaData(data);
    } catch (err) {
      error(t('errors.network'), {
        title: t('errors.generic')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (err) {
      error(t('errors.network'), {
        title: t('errors.generic')
      });
    }
  };

  useEffect(() => {
    loadCaixaData();
    loadProducts();
  }, []);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        produto_id: editingTransaction.produto_id || '',
        quantidade: editingTransaction.quantidade,
        tipo: editingTransaction.tipo,
        valor_total: editingTransaction.valor_total
      });
      setShowForm(true);
    }
  }, [editingTransaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.quantidade || !formData.valor_total) {
      error(t('forms.required_field'), {
        title: t('common.error')
      });
      return;
    }

    // Se é uma nova movimentação, produto_id é obrigatório
    if (!editingTransaction && !formData.produto_id) {
      error(t('forms.required_field'), {
        title: t('common.error')
      });
      return;
    }

    try {
      const movimentacao = {
        quantidade: parseInt(formData.quantidade),
        tipo: formData.tipo,
        valor_total: parseFloat(formData.valor_total)
      };

      // Só incluir produto_id se for fornecido
      if (formData.produto_id) {
        movimentacao.produto_id = parseInt(formData.produto_id);
      }

      if (editingTransaction) {
        await caixaAPI.updateMovimentacao(editingTransaction.id, movimentacao);
        success(t('cashier.transaction_updated'), {
          title: t('common.success')
        });
      } else {
        await caixaAPI.createMovimentacao(movimentacao);
        success(t('cashier.transaction_created'), {
          title: t('common.success')
        });
      }

      setShowForm(false);
      setEditingTransaction(null);
      setFormData({
        produto_id: '',
        quantidade: '',
        tipo: 'entrada',
        valor_total: ''
      });
      loadCaixaData();
    } catch (err) {
      error(t('errors.generic'), {
        title: t('common.error')
      });
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingTransaction(null);
    setFormData({
      produto_id: '',
      quantidade: '',
      tipo: 'entrada',
      valor_total: ''
    });
  };

  const handleDelete = async (id, productName) => {
    
    try {
      const confirmed = await confirmDelete(productName || `Movimentação ${id}`);
      
      if (!confirmed) return;

      await caixaAPI.deleteMovimentacao(id);
      loadCaixaData();
      success(t('cashier.transaction_deleted'), {
        title: t('common.success')
      });
    } catch (err) {
      error(t('errors.generic'), {
        title: t('common.error')
      });
    } finally {
      hideConfirmation();
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
    tipo: {
      type: 'select',
      label: t('cashier.type'),
      options: [
        { value: 'entrada', label: t('cashier.entry') },
        { value: 'saida', label: t('cashier.exit') }
      ]
    },
    dateRange: {
      type: 'dateRange',
      label: t('cashier.date_range')
    },
    valueRange: {
      type: 'range',
      label: t('cashier.value_range')
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <>
      <SkipLink />
      <div className="min-h-screen bg-gray-100">
        <Header title={t('cashier.title')} onLogout={handleLogout} />

        {/* Main Content */}
        <main id="main-content" className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8" tabIndex="-1">
          {/* Resumo do Caixa */}
          <section aria-label="Resumo financeiro" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-green-500" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {t('cashier.total_entries')}
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      R$ {caixaData.total_entradas.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingDown className="h-8 w-8 text-red-500" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {t('cashier.total_exits')}
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      R$ {caixaData.total_saidas.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className={`h-8 w-8 ${caixaData.saldo_atual >= 0 ? 'text-blue-500' : 'text-red-500'}`} aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {t('cashier.current_balance')}
                    </p>
                    <p className={`text-lg font-medium ${caixaData.saldo_atual >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      R$ {caixaData.saldo_atual.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 flex items-center justify-center">
                <Button
                  onClick={() => {
                    if (showForm && !editingTransaction) {
                      setShowForm(false);
                    } else {
                      setEditingTransaction(null);
                      setFormData({
                        produto_id: '',
                        quantidade: '',
                        tipo: 'entrada',
                        valor_total: ''
                      });
                      setShowForm(true);
                    }
                  }}
                  variant={showForm && !editingTransaction ? "secondary" : "primary"}
                  className="w-full"
                  aria-expanded={showForm}
                >
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  {showForm && !editingTransaction ? t('common.cancel') : t('cashier.new_transaction')}
                </Button>
              </Card>
            </div>
          </section>

          {/* Formulário de Nova Movimentação */}
          {showForm && (
            <Modal
              isOpen={showForm}
              onClose={handleCancelEdit}
              title={editingTransaction ? t('cashier.edit_transaction') : t('cashier.new_transaction')}
              size="lg"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="produto_id" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('cashier.product')} {editingTransaction && !editingTransaction.produto_id && '(Produto excluído)'}
                    </label>
                    {editingTransaction && !editingTransaction.produto_id ? (
                      <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
                        {editingTransaction.produto_nome || 'Produto excluído'}
                      </div>
                    ) : (
                      <select
                        id="produto_id"
                        name="produto_id"
                        value={formData.produto_id}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required={!editingTransaction}
                        aria-required={!editingTransaction}
                      >
                        <option value="">{t('forms.select_placeholder')}</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.nome}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('cashier.type')}
                    </label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="entrada">{t('cashier.entry')}</option>
                      <option value="saida">{t('cashier.exit')}</option>
                    </select>
                  </div>

                  <Input
                    type="number"
                    id="quantidade"
                    name="quantidade"
                    label={t('cashier.quantity')}
                    value={formData.quantidade}
                    onChange={handleInputChange}
                    min="1"
                    required
                    aria-required="true"
                    placeholder={t('forms.enter_quantity')}
                  />

                  <Input
                    type="number"
                    id="valor_total"
                    name="valor_total"
                    label={t('cashier.total_value')}
                    value={formData.valor_total}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                    aria-required="true"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelEdit}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    {editingTransaction ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                        {t('common.save')}
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                        {t('common.add')}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Modal>
          )}

          {/* Lista de Movimentações */}
          <section aria-label={t('cashier.recent_transactions')}>
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('cashier.recent_transactions')}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
                  <div className="flex-1 sm:w-64">
                    <SearchBar
                      value={searchTerm}
                      onChange={setSearchTerm}
                      placeholder={t('cashier.search_transactions')}
                    />
                  </div>
                  <Button
                    onClick={() => setShowFilterModal(true)}
                    variant="secondary"
                    className="whitespace-nowrap"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {t('common.filters')}
                    {Object.keys(filters).length > 0 && (
                      <Badge variant="primary" className="ml-2">
                        {Object.keys(filters).length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
              
              {isLoading ? (
                <Loading />
              ) : filteredAndSortedMovimentacoes.length === 0 ? (
                <EmptyState
                  title={searchTerm ? t('cashier.no_transactions_found') : t('cashier.no_transactions')}
                  description={searchTerm ? t('cashier.try_different_search') : t('cashier.add_first_transaction')}
                  icon={<Package className="h-12 w-12" />}
                  action={!searchTerm && (
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('cashier.new_transaction')}
                    </Button>
                  )}
                />
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200" role="table" aria-label={t('cashier.recent_transactions')}>
                      <thead className="bg-gray-50">
                        <tr>
                          <SortableTableHeader 
                            sortKey="data_movimentacao"
                            currentSort={sortConfig}
                            onSort={handleSort}
                            icon={<Calendar className="h-4 w-4" />}
                          >
                            {t('cashier.date')}
                          </SortableTableHeader>
                          <SortableTableHeader 
                            sortKey="produto.nome"
                            currentSort={sortConfig}
                            onSort={handleSort}
                            icon={<Package className="h-4 w-4" />}
                          >
                            {t('cashier.product')}
                          </SortableTableHeader>
                          <SortableTableHeader 
                            sortKey="tipo"
                            currentSort={sortConfig}
                            onSort={handleSort}
                          >
                            {t('cashier.type')}
                          </SortableTableHeader>
                          <SortableTableHeader 
                            sortKey="quantidade"
                            currentSort={sortConfig}
                            onSort={handleSort}
                            icon={<Hash className="h-4 w-4" />}
                          >
                            {t('cashier.quantity')}
                          </SortableTableHeader>
                          <SortableTableHeader 
                            sortKey="valor_total"
                            currentSort={sortConfig}
                            onSort={handleSort}
                            icon={<DollarSign className="h-4 w-4" />}
                          >
                            {t('cashier.total_value')}
                          </SortableTableHeader>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('common.actions')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedMovimentacoes.map((mov) => (
                          <tr key={mov.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(mov.data_movimentacao)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {mov.produto?.nome || mov.produto_nome || `Produto ID: ${mov.produto_id}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Badge 
                                variant={mov.tipo === 'entrada' ? 'success' : 'danger'}
                                className="inline-flex items-center"
                              >
                                {mov.tipo === 'entrada' ? (
                                  <TrendingUp className="h-3 w-3 mr-1" aria-hidden="true" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 mr-1" aria-hidden="true" />
                                )}
                                {mov.tipo === 'entrada' ? t('cashier.entry') : t('cashier.exit')}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {mov.quantidade}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {mov.tipo === 'entrada' ? '+' : '-'} R$ {mov.valor_total.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2" role="group" aria-label={`Ações para ${mov.produto?.nome}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(mov)}
                                  aria-label={`${t('common.edit')} ${mov.produto?.nome || mov.produto_nome}`}
                                  icon={<Edit className="w-4 h-4" />}
                                >
                                  {t('common.edit')}
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(mov.id, mov.produto?.nome || mov.produto_nome)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  aria-label={`${t('common.delete')} ${mov.produto?.nome || mov.produto_nome}`}
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
                  <div className="lg:hidden space-y-4">
                    {filteredAndSortedMovimentacoes.map((mov) => (
                      <Card key={mov.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                            <h4 className="text-sm font-medium text-gray-900">
                              {mov.produto?.nome || mov.produto_nome || `Produto ID: ${mov.produto_id}`}
                            </h4>
                          </div>
                          <div className="flex flex-col gap-2 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(mov)}
                              aria-label={`${t('common.edit')} ${mov.produto?.nome || mov.produto_nome}`}
                              icon={<Edit className="w-4 h-4" />}
                              className="p-2"
                            />
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(mov.id, mov.produto?.nome || mov.produto_nome)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                              aria-label={`${t('common.delete')} ${mov.produto?.nome || mov.produto_nome}`}
                              icon={<Trash2 className="w-4 h-4" />}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                            <span className="text-gray-600">{formatDate(mov.data_movimentacao)}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Badge 
                              variant={mov.tipo === 'entrada' ? 'success' : 'danger'}
                              className="inline-flex items-center"
                            >
                              {mov.tipo === 'entrada' ? (
                                <TrendingUp className="h-3 w-3 mr-1" aria-hidden="true" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" aria-hidden="true" />
                              )}
                              {mov.tipo === 'entrada' ? t('cashier.entry') : t('cashier.exit')}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center">
                            <Hash className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                            <span className="text-gray-600">{mov.quantidade} {t('cashier.units')}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                            <span className={`font-medium ${
                              mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {mov.tipo === 'entrada' ? '+' : '-'} R$ {mov.valor_total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </section>
        </main>

        {/* Filter Modal */}
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          filters={filters}
          filterOptions={filterOptions}
        />

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
      </div>
    </>
  );
};

export default Caixa;
