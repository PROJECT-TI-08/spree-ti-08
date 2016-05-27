Spree::CheckoutController.class_eval do
  
    before_action :load_order_with_lock, except: [:payment_ok,:payment_fail]
    before_action :ensure_valid_state_lock_version, only: [:update]
    before_action :set_state_if_present, except: [:payment_ok,:payment_fail]

    before_action :ensure_order_not_completed, except: [:payment_ok,:payment_fail]
    before_action :ensure_checkout_allowed, except: [:payment_ok,:payment_fail]
    before_action :ensure_sufficient_stock_lines, except: [:payment_ok,:payment_fail]
    before_action :ensure_valid_state, except: [:payment_ok,:payment_fail]

    before_action :associate_user, except: [:payment_ok,:payment_fail]
    before_action :check_authorization, except: [:payment_ok,:payment_fail]
    before_action :setup_for_current_state, except: [:payment_ok,:payment_fail]
    before_action :add_store_credit_payments, only: [:update]

    before_filter :check_authorization, except: [:payment_ok,:payment_fail]
    before_filter :check_registration, :except => [:registration, :update_registration,:payment_ok,:payment_fail]

   def payment_ok
      byebug
      order_id  = params.require(:order_id)
      boleta_id = params.require(:boleta_id)
      @order    = Spree::Order.find(order_id)
      response  = InvoicesController.new.obtener_factura(boleta_id)
      if(response[:status])
        info = response[:result]
        flash.notice = 'La orden fue creada correctamente, el numero de boleta generado fue #'+ info[0]['_id'].to_s+
        ', el monto bruto '+info[0]['bruto'].to_s+', el iva '+info[0]['iva'].to_s+' y el total '+info[0]['total'].to_s
      end
      @current_order = nil
      flash['order_completed'] = true
      logger.debug('Payment_ok')
      redirect_to completion_route
   end

   def payment_fail
      byebug
      order_id  = params.require(:order_id)
      boleta_id = params.require(:boleta_id)
      @order    = Spree::Order.find(order_id)
      response  = InvoicesController.new.obtener_factura(boleta_id)
      if(response[:status])
        info = response[:result]
        flash[:error] = 'La boleta #'+boleta_id+' fue rechazada'
      else
         flash[:error] = info[:result]
      end
      @current_order = nil
      flash['order_completed'] = true
      logger.debug('Payment_fail')
      #redirect_to(checkout_state_path(@order.state)) && return
      redirect_to spree.cart_path
   end

   def update
      if @order.update_from_params(params, permitted_checkout_attributes, request.headers.env)
        @order.temporary_address = !params[:save_user_address]
        unless @order.next
          flash[:error] = @order.errors.full_messages.join("\n")
          redirect_to(checkout_state_path(@order.state)) && return
        end

        if @order.completed?
          result   = InvoicesController.new.crear_boleta('323232323','571262b8a980ba030058ab56',@order.total)  
          info     = result[:result]
          boleta   = info['_id']
          url_ok   = CGI.escape('http://localhost:3000/store/webpay_ok?order_id='+@order.id.to_s+'&boleta_id='+boleta.to_s)
          url_fail = CGI.escape('http://localhost:3000/store/webpay_fail?order_id='+@order.id.to_s+'&boleta_id='+boleta.to_s)
          redirect_to('https://integracion-2016-dev.herokuapp.com/web/pagoenlinea?callbackUrl='+url_ok.to_s+'&cancelUrl='+url_fail.to_s) && return
          #http://localhost:5000/store/check_webpay
        else
          redirect_to checkout_state_path(@order.state)
        end
      else
        render :edit
      end
    end
end