Spree::OrdersController.class_eval do

# Adds a new item to the order (creating a new order if none already exists)
    def populate
      order     = current_order(create_order_if_necessary: true)
      variant   = Spree::Variant.find(params[:variant_id])
      quantity  = params[:quantity].to_i
      real_qty  = params[:real_qty].to_i || 0
      sku       = params[:sku].to_i || 0
      options   = params[:options] || {}
      direccion = params[:order][:direccion] || ''
      cupon     = params[:order][:cupon] || ''
      total     = 0
      if direccion.blank?
          error = 'Por favor, rellena el campo dirección.'
      else  
        if quantity > real_qty
          error = 'Lo sentimos, la cantidad solicitada es mayor a lo que actualmente tenemos en stock'
        else

          if !cupon.blank?
            promotion = Promotion.where('codigo = ?',cupon).first
            if promotion
              if DateTime.now >= promotion.inicio && DateTime.now <= promotion.fin
                total = promotion.precio * quantity
              else
                error = 'Cupón vencido.'
              end
            else
              error = 'Cupón de descuento no existente.'
            end
          end

          # 2,147,483,647 is crazy. See issue #2695.
          if quantity.between?(1, 2_147_483_647)
            begin
              order.contents.add(variant, quantity, options)
            rescue ActiveRecord::RecordInvalid => e
              error = e.record.errors.full_messages.join(", ")
            end
          else
            error = Spree.t(:please_enter_reasonable_quantity)
          end
        end
      end
      
      if error
        flash[:error] = error
        redirect_back_or_default(spree.root_path)
      else
        respond_with(order) do |format|
          if total > 0
            new_price = total 
          else
            new_price = order.total
          end 
          result   = InvoicesController.new.crear_boleta('571262b8a980ba030058ab57','572aac69bdb6d403005fb049',new_price) 
          info     = result[:result]
          boleta   = info['_id']
          url_ok   = CGI.escape('http://integra8.ing.puc.cl/store/webpay_ok?order_id='+order.id.to_s+'&boleta_id='+boleta.to_s+
            '&sku='+sku.to_s+'&direccion='+direccion+'&qty='+quantity.to_s)
          url_fail = CGI.escape('http://integra8.ing.puc.cl/store/webpay_fail?order_id='+order.id.to_s+'&boleta_id='+boleta.to_s+
            '&sku='+sku.to_s+'&direccion='+direccion)
          redirect_to('https://integracion-2016-prod.herokuapp.com/web/pagoenlinea?callbackUrl='+url_ok.to_s+'&cancelUrl='+url_fail.to_s+
            '&boletaId='+boleta.to_s) && return
        end
      end
    end

   def payment_ok
      order_id  = params.require(:order_id)
      boleta_id = params.require(:boleta_id)
      sku       = params.require(:sku)
      direccion = params.require(:direccion)
      qty       = params.require(:qty)
      order_aux = Spree::Order.find(order_id)
      @order = current_order
      response  = InvoicesController.new.obtener_factura(boleta_id)
      if(response[:status])
        info = response[:result][0]
        flash.notice = 'La orden fue creada correctamente.'
        #Spawnling.new do
          #address_info = order_aux.ship_address()
          #address = 'N.A'
          #if address_info
          #  address = address_info[:address1] +' '+address_info[:address2] + ' ' + address_info[:city]
          #end
          order_obj = Order.create!({
            :_id                => boleta_id,
            :canal              => 'b2c',
            :proveedor          => info['proveedor'],
            :cliente            => info['cliente'],
            :sku                => sku.to_i,
            :cantidad           => qty,
            :cantidadDespachada => qty,
            :precioUnitario     => info['total'].to_i,
            :fechaEntrega       => info['created_at'],
            :fechaDespachos     => [],
            :estado             => info['estado'],
            :tipo               => 1 })
      	  quantity = 0
      	  price    = 0
          @order.line_items().each do |item|
            sku_aux = item.variant.sku
  	        quantity = item.quantity
  	        price    = item.price
            response_order = OrdersController.new.despachar_process(sku_aux,price.to_i,boleta_id,quantity,direccion)
            Applog.debug(sku.to_s + ' ' +boleta_id.to_s,'despacho_correcto') 
	        end
      end
      if @order = current_order
        @order.empty!
      end
      @current_order = nil
      flash['order_completed'] = true
      logger.debug('Payment_ok')
      respond_with do |format|
        format.html { redirect_to response_payment_path(boleta_id: info['_id'],level: 'panel panel-primary',title: 'Información de la orden',
          bruto: info['bruto'], iva: info['iva'], total: info['total'], sku: sku, orden_id: order_id)}
      end
   end

   def payment_fail
      order_id  = params.require(:order_id)
      boleta_id = params.require(:boleta_id)
      sku       = params.require(:sku)
      order_aux = Spree::Order.find(order_id)
      response  = InvoicesController.new.obtener_factura(boleta_id)
      if(response[:status])
        info = response[:result][0]
        flash[:error] = 'La boleta #'+boleta_id+' fue rechazada'
      else
         flash[:error] = info[:result]
      end
      if @order = current_order
        @order.empty!
      end
      @current_order = nil
      flash['order_completed'] = true
      logger.debug('Payment_fail')
      respond_with do |format|
        format.html { redirect_to response_payment_path(boleta_id: info['_id'],level: 'panel panel-danger',title: 'Información de la orden',
          bruto: info['bruto'], iva: info['iva'], total: info['total'], sku: sku, orden_id: order_id) }
      end
   end

 end
