class ApiController < ApplicationController
   #before_filter :authenticate_user!

###############################################
################### CLIENTE ###################
###############################################

def saldos
  result = SaldoInfo.all
  respond_to do |format|
    format.json  { render json: result }
    format.html  { render json: result }
  end
end

def stocks

  #'572aad41bdb6d403005fb418','572aad41bdb6d403005fb4b6'
  #'571262aaa980ba030058a320','571262aaa980ba030058a3ae'dev 
  #571262aaa980ba030058a320
  #571262aaa980ba030058a3ae
  products = ["18","24","26","37"]
  skus = Hash.new
  result_dates = ProductsStock.select([:date]).where('store IN (?,?)','572aad41bdb6d403005fb418','572aad41bdb6d403005fb4b6').group(:date)
  dates = Array.new
  result_dates.each do |date_item|
    dates.push(date_item.date)
  end
  products.each do |item|
    skus[item] = Array.new
    result_dates.each do |aux|
        data = ProductsStock.where('store IN (?,?) AND date = ? AND sku = ?','572aad41bdb6d403005fb418','572aad41bdb6d403005fb4b6',aux.date,item).group(:date,:sku).sum(:qty)
        if data.values[0].nil?
          skus[item].push(0)
        else
          skus[item].push(data.values[0])
        end
    end
  end
  
  respond_to do |format|
    format.json  { render json: {:labels => dates,:values => skus }}
    format.html  { render json: {:labels => dates,:values => skus }}
  end
end

def orders_data
  inicio  = params.require(:inicio)
  fin     = params.require(:fin)
  type    = params.require(:type)

  if inicio == '0'
    inicio = DateTime.now - 5.days
    fin    = DateTime.now
  end  
  dates  = Array.new
  values = Array.new
  if type == '0'
     result = Order.all.where('created_at >= ? AND created_at <= ?',inicio,fin)
  else
    canal = ''
    if type == '1'
      canal = 'ftp'
    end
    if type == '2'
      canal = 'b2c'
    end
    if type == '3'
      canal = 'b2b'
    end
    result = Order.all.where('created_at >= ? AND created_at <= ? AND canal = ?',inicio,fin,canal)
  end 

  result.each do |order|
    dates.push(order.created_at)
    if !order.factura.nil?
       values.push(order.factura.total)
    else
       values.push(order.precioUnitario * order.cantidad)
    end
  end
  respond_to do |format|
    format.json  { render json: {:values => values,:dates => dates, :result => result } }
    format.html  { render json: {:values => values,:dates => dates, :result => result } }
  end
end

def orders_chart
  result = Order.all
  b2b = 0
  b2c = 0
  ftp = 0
  result.each do |order|
    if !order.factura.nil?
      if order.canal == "b2b"
        b2b = order.factura.total + b2b
      end
      if order.canal == "ftp"
        ftp = order.factura.total + ftp
      end
    end
    if order.canal == "b2c"
       b2c = (order.precioUnitario * order.cantidad) + b2c
    end
  end
  result_price = Hash.new
  result_price[:b2b] = b2b
  result_price[:ftp] = ftp
  result_price[:b2c] = b2c
  result_number = Order.all.group(:canal).count
  respond_to do |format|
    format.json  { render json: {:byprice => result_price,:bynumber => result_number } }
    format.html  { render json: {:byprice => result_price,:bynumber => result_number } }
  end
end

def webhook
 begin
    data_json = JSON.parse request.body.read
    promotion_obj = Promotion.create!({
             :sku       => data_json['sku'].to_s, 
             :precio    => data_json['precio'].to_i,
             :inicio    => Time.strptime(data_json['inicio'].to_s, '%Q').to_s, 
             :fin       => Time.strptime(data_json['fin'].to_s, '%Q').to_s,
             :publicar  => data_json['publicar'],
             :codigo    => data_json['codigo'].to_s })

    if data_json['publicar']
      FacebookController.new.set_post(data_json['precio'],data_json['sku'].to_s,data_json['inicio'].to_s,data_json['fin'].to_s,data_json['codigo'].to_s)
      TwitterController.new.set_tweet(data_json['precio'],data_json['sku'].to_s,data_json['inicio'].to_s,data_json['fin'].to_s,data_json['codigo'].to_s)
    end
    render :nothing => true, :status => 200
  rescue => ex
    Applog.debug(ex.message,'webhook')
  end
end

# Metodo para notificar a un proveedor un pago
def enviar_transaccion(trx,idfactura)
 begin
  logger.debug("...Inicio enviar transaccion")
  info = InfoGrupo.where('id_banco= ?',trx['destino']).first
  url = 'http://integra'+info[:numero].to_s+'.ing.puc.cl/api/pagos/recibir/'+trx[0]['_id'].to_s
  #url = 'http://localhost:3000/api/pagos/recibir/'+trx['_id'].to_s
  request = Typhoeus::Request.new(
    url,
    method: :get,
    params:{
      idfactura: idfactura
    },
    headers: { ContentType: "application/json"})
  response = request.run
  logger.debug("...Fin enviar transaccion")
  return {:validado => true, :trx => trx}
 rescue => ex
  Applog.debug(ex.message,'enviar_transaccion')
  return {:validado => false, :trx => trx}
end
end

# Metodo con el cual el cliente recibe una
# factura y procede a pagarla
def validar_factura
   begin
    logger.debug("...Inicio validar factura")
    idfactura = params.require(:idfactura)
    result = Hash.new 
    result[:validado] = false
    result[:idfactura] = idfactura 
    response_inv = InvoicesController.new.obtener_factura(idfactura)

    if response_inv[:status]
      result_inv = response_inv[:result]
      cliente = InfoGrupo.where('id_grupo = ?',result_inv[0]['cliente']).first
      # Una vez recibida la factura se procede a realizar el pago
      response_bank =BankController.new.transferir(result_inv[0]['total'],
        Rails.application.config.bank_account,cliente['id_banco'])
      order_obj = Order.where('_id = ?', result_inv[0]['oc'].to_s).first
      if response_bank[:status]
        result_bank = response_bank[:result]
        # Se envia la transaccion para que el cliente verifique el pago
        result[:validado] = true
        Spawnling.new do
	      begin
          ########## Actualizamos factura localmente ###########
          factura = Factura.where('_id = ?', idfactura).first
          if !factura.blank?
             factura.idtrx = result_bank['_id']
             factura.save
          else
	           logger.debug(result_bank);
             logger.debug(result_inv);  
             factura_obj = Factura.create!({
             :_id    => result_inv[0]['_id'].to_s, 
             :bruto  => result_inv[0]['bruto'].to_f,
             :iva    => result_inv[0]['iva'].to_f, 
             :total  => result_inv[0]['total'].to_f,
             :idtrx    => result_bank['_id'].to_s,
	           :order_id => order_obj['id'].to_i })         
          end
          order_obj.estado = 'pagada'
          order_obj.save
          enviar_transaccion(result_bank,idfactura)
       	   rescue => ex
    	     Applog.debug(ex.message,'validar_factura_2')
   	    end
	      end
      else
        order_obj.estado = 'anulada por error pago'
        order_obj.save
        result[:validado] = false
        OrdersController.new.anular_oc(result_inv[0]['oc'].to_s,'Error')
      end  
    end
    logger.debug("...Fin validar factura")
    #respond_with result, json: result
    respond_to do |format|
        format.json  { render json: result }
        format.html  { render json: result }
     end
   rescue => ex
     Applog.debug(ex.message,'validar_factura')
     respond_to do |format|
        format.json  { render json: {:status => false} }
        format.html  { render json: {:status => false} }
     end
   end	
end

# Metodo con el cual un proveedor notifica a un
# cliente que sus productos han sido despachados
def validar_despacho
   begin 
    idfactura = params.require(:idfactura)
    result    = Hash.new 
    result[:idfactura] = idfactura 
    result[:validado]  = true
    logger.debug("...Validar despacho")


    response_inv = InvoicesController.new.obtener_factura(idfactura)
    if response_inv[:status]
     factura     = response_inv[:result]
     if factura
      order_obj = Order.where('_id = ?',factura[0]['oc'].to_s).first
      order_obj.estado = 'despachada'
      order_obj.save
     end
    end

    # Una vez se ha pagado el proveedor confirma el
    # despacho de los insumos
    Spawnling.new do
      mover_productos()
    end
    #respond_with result, json: result
    respond_to do |format|
        format.json  { render json: result }
        format.html  { render json: result }
     end
   rescue => ex
     Applog.debug(ex.message,'validar_despacho')
     respond_to do |format|
        format.json  { render json: {:status => false} }
        format.html  { render json: {:status => false} }
     end
   end
end

# Metodo para mover los productos del almacen de pulmon
# a los almacenes centrales
def mover_productos_pulmon()
  begin
   logger.debug("...Inicio mover productos pulmon")
   stock_aux = StoresController.new

   almacen_pulmon = Store.where('pulmon = ? AND despacho = ? AND recepcion = ?',true,false,false).first
   list_products = Array.new
   Product.all.each do |producto|
     sku_aux = producto[:sku]
     result_skus = stock_aux.get_stock(sku_aux,almacen_pulmon['_id'])[:result]
     result_skus.each do |item|
        list_products.push(item)
     end
   end  
    j = 0 
  	result_almacenes = StoresController.new.get_almacenes
    if(result_almacenes[:status])
       # Recorremos los almacenes centrales y vamos moviendo los productos que hay
       # en el almacen de recepción. Se van llenando en orden los almacenes centrales.
       result_almacenes[:result].each() do |fabrica|
           if(fabrica['pulmon'] == false && fabrica['despacho'] == false && fabrica['recepcion'] == false)
              cantidad_aux = fabrica['totalSpace'].to_i - fabrica['usedSpace'].to_i
              list_products.shuffle.each do |item|
                  if j < cantidad_aux
                    request_mov  = stock_aux.mover_stock(item['_id'],fabrica['_id'])
                    response_mov = request_mov.run
                    if response_mov.success?
                          logger.debug("...Producto movido correctamente (mover_productos_pulmon)")
                    end
                    j = j + 1
                  else
                    j = 0 
                    break
                  end
              end
           end
       end
    end
    logger.debug("...Fin mover productos")
   return  {:status => true}
  rescue => ex
    Applog.debug(ex.message,'mover_productos')
  end
end


# Metodo para mover los productos del almacen de recepción
# a los almacenes centrales
def mover_productos()
  begin
    logger.debug("...Inicio mover productos")
    stock_aux = StoresController.new

    almacen_recepcion = Store.where('pulmon = ? AND despacho = ? AND recepcion = ?',false,false,true).first
    Product.all.each do |producto|
        sku_aux = producto[:sku]
        list_products     = stock_aux.get_stock(sku_aux,almacen_recepcion['_id'])
        j = 0
        result_almacenes = StoresController.new.get_almacenes
        if(result_almacenes[:status])
          # Recorremos los almacenes centrales y vamos moviendo los productos que hay
          # en el almacen de recepción. Se van llenando en orden los almacenes centrales.
          result_almacenes[:result].each() do |fabrica|
              if(fabrica['pulmon'] == false && fabrica['despacho'] == false && fabrica['recepcion'] == false)
                  cantidad_aux = fabrica['totalSpace'].to_i - fabrica['usedSpace'].to_i
                  if list_products[:status]
                      list_products[:result].each do |item|
                          if j < cantidad_aux
                            request_mov  = stock_aux.mover_stock(item['_id'],fabrica['_id'])
                            response_mov = request_mov.run
                            if response_mov.success?
                                  logger.debug("...Producto movido correctamente (mover_productos)")
                            end
                            j = j + 1
                          else
                            j = 0
                            break
                          end
                      end
                  end
              end
          end
        end
    end
    logger.debug("...Fin mover productos")
   return  {:status => true}
  rescue => ex
    Applog.debug(ex.message,'mover_productos')
  end
end

###############################################
################# PROVEEDOR ###################
###############################################

# Metodo para recibir orden de compra y procesarla
# o rechazarla segun sea el caso
def recibir_oc
  begin
  logger.debug("...Inicio recibir oc")
  id_order = params.require(:idoc)
  url      = Rails.configuration.oc_api_url + "obtener/" + id_order
  request  = Typhoeus::Request.new(
    url, 
    method: :get,
    headers: { ContentType: "application/json"})
  response = request.run
  oc_order = JSON.parse(response.body)[0]
  product = Product.where('sku = ?',oc_order['sku']).first
  if product.nil?
    OrdersController.new.rechazar_oc(id_order,'No hay producto en existencia')
    data_result = {:aceptado => false, :idoc => id_order }
    #Spawnling.new do
    #  sleep(5)
    #  logger.info('#####_produccion')
    #end
  else
    total = consultar_stock(oc_order['sku'])
    if(oc_order['cantidad'] < total)    
        response_recep = OrdersController.new.recepcionar_oc(id_order)
        if response_recep[:status] 
          
            ###### Guardamos datos orden localmente ######
            order_obj = Order.create!({
              :_id                => oc_order['_id'], 
              :canal              => oc_order['canal'],
              :proveedor          => oc_order['proveedor'], 
              :cliente            => oc_order['cliente'],
              :sku                => oc_order['sku'].to_i, 
              :cantidad           => oc_order['cantidad'].to_i, 
              :cantidadDespachada => oc_order['cantidadDespachada'].to_i,
              :precioUnitario    => oc_order['precioUnitario'].to_i, 
              :fechaEntrega       => oc_order['fechaEntrega'],
              :fechaDespachos     => oc_order['fechaDespachos'], 
              :estado             => oc_order['estado'],
              :tipo               => 1
              })
            response_inv = InvoicesController.new.emitir_factura(id_order)
            if response_inv[:status]
               result = response_inv[:result]
               ##### Guardamos factura localmente #####
                factura_obj = Factura.create!({
                :_id    => result['_id'], 
                :bruto  => result['bruto'].to_f,
                :iva    => result['iva'].to_f, 
                :total  => result['total'].to_f,
		            :order_id => order_obj['id'] })
                Spawnling.new do
                  enviar_factura(result)
                end
                data_result = {:aceptado => true, :idoc => id_order}
            else
                OrdersController.new.rechazar_oc(id_order,'OC invalida')
                data_result = {:aceptado => false, :idoc => id_order }
            end  
        else
            OrdersController.new.rechazar_oc(id_order,'No hay producto en existencia')
            data_result = {:error => response_recep [:result], :aceptado => false, :idoc => id_order}
        end
    else
        OrdersController.new.rechazar_oc(id_order,'No hay producto en existencia')
        data_result = {:aceptado => false, :idoc => id_order }
    end
  end
  logger.debug("...Fin recibir oc")
  respond_to do |format|
    format.json  { render json: data_result}
    format.html { render json: data_result }
  end
  rescue => ex
    Applog.debug(ex.message,'recibir_oc')
    respond_to do |format|
     format.json  { render json: {:aceptado => false}}
     format.html { render json: {:aceptado => false}}
    end
  end
end

# Metodo para enviar facturas emitidas a los clientes 
def enviar_factura(factura)
  begin
  logger.debug("...Iniciar enviar factura")
  info = InfoGrupo.where('id_grupo = ?',factura['cliente']).first
  url = 'http://integra'+info[:numero].to_s+'.ing.puc.cl/api/facturas/recibir/'+factura['_id'].to_s
  #url = 'http://localhost:3000/api/facturas/recibir/'+factura['_id'].to_s
  request = Typhoeus::Request.new(
    url,
    method: :get,
    headers: { ContentType: "application/json"})
  response = request.run  
  logger.debug("...Fin enviar factura")
  return {:validado => true, :factura => factura}
  rescue => ex
    Applog.debug(ex.message,'enviar_factura')
    return {:validado => false, :factura => factura}
  end
end

# Metodo para notificar despachos a los clientes
def enviar_despacho(idfactura,cliente)
 begin 
  logger.debug("...Inicio enviar despacho")
  info = InfoGrupo.where('id_grupo = ?',cliente).first
  url = 'http://integra'+info[:numero].to_s+'.ing.puc.cl/api/despachos/recibir/'+idfactura.to_s
  #url = 'http://localhost:3000/api/despachos/recibir/'+idfactura.to_s
  request = Typhoeus::Request.new(
    url,
    method: :get,
    headers: { ContentType: "application/json"})
  response = request.run
  logger.debug("...Fin enviar despacho")
  return {:validado => true}
  rescue => ex
    Applog.debug(ex.message,'enviar_despacho')
    return {:validado => false}
  end
end

# Metodo con el cual un proveedor verifica que
# han pagado una factura
def validar_pago
   begin
    logger.debug("...Inicio validar pago")
    idtrx     = params.require(:idtrx)
    idfactura = params.require(:idfactura)
    result = Hash.new 
    result[:idtrx] = idtrx 
    result[:validado] = false
    if !idtrx.blank?
      # Se marca la factura como pagadá
      response_inv = InvoicesController.new.pagar_factura(idfactura)
      if response_inv[:status]
        result[:validado] = true
      end
      Spawnling.new do
        ###### Guardamos trx localmente ######
        factura = Factura.where('_id = ?',idfactura).first
        if !factura.blank?
          factura['idtrx'] = idtrx
          factura.save
        end
        ######################################

        response_fac = InvoicesController.new.obtener_factura(idfactura)
        if response_fac[:status]
         factura     = response_fac[:result]
         if factura
          order_obj = Order.where('_id = ?',factura[0]['oc'].to_s).first
          order_obj.estado = 'pagada'
          order_obj.save
         end
        end   

        # Se procede a despachar lo establecido en la factura
        mover_despachar(idfactura)
      end
    end
    logger.debug("...Fin validar pago")
     #respond_with result, json: result
     respond_to do |format|
        format.json  { render json: result }
        format.html  { render json: result }
     end
   rescue => ex
     Applog.debug(ex.message,'validar_pago')
   end
end

# Metodo para mover los productos al almacen de despacho
# para su posterior envio
def mover_despachar(idfactura)
  begin
   logger.debug("...Inicio mover despachar")
   response_inv = InvoicesController.new.obtener_factura(idfactura)
   factura      = nil
   oc           = nil
   sku          = nil
   cantidad     = nil
   if response_inv[:status]
    factura     = response_inv[:result]
    request_oc  = OrdersController.new.obtener_oc(factura[0]['oc'])
    if request_oc[:status]
      oc       = request_oc[:result]
      sku      = oc[0]['sku']
      cantidad = oc[0]['cantidad']
    end
   end
   stock_aux = StoresController.new
   product   = Product.where('sku = ?',sku).first
   precio    = product['precio_unitario'] 
   grupo     = InfoGrupo.where('id_grupo = ?',oc[0]['cliente']).first
   almacen_cliente  = grupo['id_almacen']
   almacen_despacho =  Store.where('pulmon = ? AND despacho = ? AND recepcion = ?',false,true,false).first
   j = 0
   flag = false
   Store.where('pulmon = ? AND despacho = ? AND recepcion = ?',false,false,false).each do |fabrica|
      list_products = stock_aux.get_stock(sku,fabrica['_id'])
      if list_products[:status]
        #new_list = list_products[:result].select{|aux| aux['despachado'] == false}
        list_products[:result].each do |item|
          if j < cantidad                 
            request_mov  = stock_aux.mover_stock(item['_id'],almacen_despacho['_id'])
            response_mov = request_mov.run 
            if response_mov.success?  
               result_mov_prod = JSON.parse(response_mov.body)                        
               request_stock = stock_aux.mover_stock_bodega(result_mov_prod['_id'],almacen_cliente,oc[0]['_id'],precio)
               response_stock = request_stock.run
               if response_stock.success?
                  logger.debug("...Product movido correctamente (mover_despachar)")
                  result_stock = JSON.parse(response_stock.body)
               end
            end
          else
            break
          end
          j = j + 1
        end
        flag = true
      end
   end
   if flag
     enviar_despacho(factura[0]['_id'],factura[0]['cliente'])
     order_obj = Order.where('_id = ?',factura[0]['oc'].to_s).first
     order_obj.estado = 'despachada'
     order_obj.save
   end
   logger.debug("...Fin mover despacho")
   return  {:status => true}
   rescue => ex
     Applog.debug(ex.message,'mover_despacho')
   end
end

########################################################################
########################## GENERAL #####################################
########################################################################

# Metodo para consultar el stock de un sku
# en los almacenes principales
def consultar_stock(sku = nil)
  begin
  logger.debug(Rails.application.config.oc_api_url)
  sku_code = sku || params.require(:sku)
  stock = 0
  hydra = Typhoeus::Hydra.new
   Store.where('pulmon = ? AND despacho = ? AND recepcion = ?',false,false,false).each do |fabrica|
    request = StoresController.new.request_sku_with_stock(fabrica['_id'])
    request.on_complete do |response|
      value = JSON.parse(response.body).select { |item| item['_id'] == sku_code }.first()
      if !value.nil?
        stock = stock + value['total'];
      end
    end
    hydra.queue(request)
  end
  response = hydra.run
  if sku.nil?
    respond_to do |format|
      format.json  { render json: {:stock => stock, :sku => sku_code} }
      format.html  { render json: {:stock => stock, :sku => sku_code} }
    end
  else
    return stock
  end
 rescue => ex
   Applog.debug(ex.message,'consultar_stock')
   respond_to do |format|
      format.json  { render json: {:status => false} }
      format.html  { render json: {:status => false} }
   end
 end
end

end
