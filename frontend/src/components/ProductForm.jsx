import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valor: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        nome: product.nome || '',
        descricao: product.descricao || '',
        valor: product.valor || ''
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = t('forms.required_field');
    }

    if (!formData.valor) {
      newErrors.valor = t('forms.required_field');
    } else if (isNaN(formData.valor) || parseFloat(formData.valor) <= 0) {
      newErrors.valor = t('forms.positive_number');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim(),
        valor: parseFloat(formData.valor)
      };

      await onSubmit(productData);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card shadow="lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            product ? 'bg-amber-100' : 'bg-blue-100'
          }`}>
            {product ? (
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? t('products.edit_product') : t('products.add_product')}
            </h2>
            <p className="text-gray-600">
              {product ? t('products.update_product_info') : t('products.fill_product_data')}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('products.product_name')}
            name="nome"
            type="text"
            required
            value={formData.nome}
            onChange={handleChange}
            placeholder={t('forms.enter_name')}
            error={errors.nome}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
              </svg>
            }
          />

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.description')}
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="4"
              placeholder={t('forms.enter_description')}
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl transition-all duration-200 ease-in-out placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 resize-none"
            />
          </div>

          <Input
            label={t('products.price')}
            name="valor"
            type="number"
            required
            value={formData.valor}
            onChange={handleChange}
            placeholder={t('forms.enter_price')}
            step="0.01"
            min="0"
            error={errors.valor}
            helperText={t('products.price_in_reais')}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            <Button
              type="submit"
              loading={isSubmitting}
              variant={product ? 'warning' : 'primary'}
              size="lg"
              className="flex-1"
              icon={
                !isSubmitting && (
                  product ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )
                )
              }
            >
              {isSubmitting 
                ? (product ? t('forms.updating') : t('forms.creating')) 
                : (product ? t('forms.update_product') : t('forms.create_product'))
              }
            </Button>
            
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              size="lg"
              className="flex-1 sm:flex-none"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            >
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProductForm;
