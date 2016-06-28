class FacebookController < ApplicationController

	def initialize	
		@graph = Koala::Facebook::API.new(Figaro.env.access_token_page_facebook)
	end

	def set_post(price='',sku='',inicio='',fin='',promo='')
		#inicio = Time.strptime(inicio, '%Q').strftime("%F %T")
		#fin   = Time.strptime(fin, '%Q').strftime("%F %T")
		product_aux = Product.where('sku = ?',sku).first
		@graph.put_connections(Figaro.env.page_id, "feed", message: "Aprovecha esta oferta, #{product_aux.nombre} por $#{price} usando el código #{promo}. 
			Promoción valida desde #{inicio} hasta #{fin}.",picture: "http://integra8.ing.puc.cl/images/"+sku+".jpg",
			:link => "http://integra8.ing.puc.cl/store")
		respond_to do |format|
  			format.all { render :nothing => true, :status => 200 }
		end
	end

end
