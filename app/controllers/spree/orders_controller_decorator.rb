Spree::OrdersController.class_eval do

# Adds a new item to the order (creating a new order if none already exists)
    def populate
      order    = current_order(create_order_if_necessary: true)
      variant  = Spree::Variant.find(params[:variant_id])
      quantity = params[:quantity].to_i
      real_qty = params[:real_qty].to_i || 0
      options  = params[:options] || {}

      if quantity > real_qty 
        error = 'Lo sentimos, la cantidad solicitada es mayor a lo que actualmente tenemos en stock'
      else
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

      if error
        flash[:error] = error
        redirect_back_or_default(spree.root_path)
      else
        respond_with(order) do |format|
          format.html { redirect_to cart_path }
        end
      end
    end

  end