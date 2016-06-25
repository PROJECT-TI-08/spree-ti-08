class ProductsController < ApplicationController
  
def index
   result = Array.new
   api = ApiController.new
   Product.all.each do |item|
		sku_stock = api.consultar_stock(item[:sku])
		result.push({:sku => item[:sku],:name => item[:nombre], :qty => sku_stock})
   end
	respond_with result	
end

def save_products_stock
  store = StoresController.new
  hydra  = Typhoeus::Hydra.new
    result = Array.new
    date   = DateTime.now
    Store.all.each do |fabrica|
      request = store.request_sku_with_stock(fabrica['_id'])
      request.on_complete do |response|
        products = JSON.parse(response.body)
        logger.debug(products)
        products.each do |item|
          ProductsStock.create!({
             :sku    => item['_id'], 
             :store  => fabrica['_id'],
             :qty    => item['total'], 
             :date   => date})
        end
      end
      hydra.queue(request)
    end
    response = hydra.run  
    respond_to do |format|
      format.json  { render json: {:status => true} }
      format.html  { render json: {:status => true} }
    end
end  

def show
  respond_with Product.find(params[:id])
end 

end