class TwitterController < ApplicationController

	def initialize	

		@client = Twitter::REST::Client.new do |config|
		  config.consumer_key        = Figaro.env.consumer_key_twitter
		  config.consumer_secret     = Figaro.env.consumer_secret_twitter
		  config.access_token        = Figaro.env.access_token_twitter
		  config.access_token_secret = Figaro.env.access_token_secret_twitter
		  logger.debug(config)
		end
	end

	def set_tweet(price='',sku='',inicio='',fin='')
		inicio = Time.strptime(inicio, '%Q').strftime("%F %T")
		fin    = Time.strptime(fin, '%Q').strftime("%F %T")
		product_aux = Product.where('sku = ?',sku).first
		@client.update_with_media("Aprovecha esta oferta, #{product_aux.nombre} por $#{price}. Promoción valida
			desde #{inicio} hasta #{fin}.", File.new(Rails.root.join('public', 'images', sku+'.jpg')))
		respond_to do |format|
  			format.all { render :nothing => true, :status => 200 }
		end
	end
end