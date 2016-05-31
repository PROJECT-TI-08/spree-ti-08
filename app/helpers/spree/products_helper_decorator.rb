Spree::ProductsHelper.module_eval do

    def get_real_quantity(product)
      @qty = ApiController.new.consultar_stock(product.sku)
      @qty.to_s
    end

    def exist_stock_product(product)
    	if @qty > 0
    	  	return true	
    	else
    		return false
    	end
    end
end