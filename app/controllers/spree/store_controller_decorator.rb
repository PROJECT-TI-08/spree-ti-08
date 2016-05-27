Spree::StoreController.class_eval do

#skip_before_action :authenticate_user, only: :apply_coupon_code_aux

def apply_coupon_code

end
end