Rails.application.routes.draw do

  # This line mounts Spree's routes at the root of your application.
  # This means, any requests to URLs such as /products, will go to Spree::ProductsController.
  # If you would like to change where this engine is mounted, simply change the :at option to something different.
  #
  # We ask that you don't use the :as option here, as Spree relies on it being the default of "spree"
  mount Spree::Core::Engine, at: '/store'
          # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  Spree::Core::Engine.routes.draw do
    get '/webpay_ok',        to: 'orders#payment_ok'
    get '/webpay_fail',      to: 'orders#payment_fail'
    get '/check_webpay',     to: 'orders#check_webpay'
    get '/response_payment', to: 'orders#response_payment', as: :response_payment
  end


  #devise_for :users
  root to: 'application#angular'    
  resources :orders, only: [:index, :show] do
  end
  resources :stores, only: [:index, :show] do
  end
  resources :products, only: [:index, :show] do
  end
  
  ############### API ##################

  #get 'api/facebook'                     => 'facebook#test'

  #get 'api/twitter'                      => 'twitter#test'

  post 'api/webhook'			               => 'api#webhook'

  get 'api/oc/recibir/:idoc'             => 'api#recibir_oc'

  get 'api/consultar/:sku'               => 'api#consultar_stock'

  get 'api/facturas/recibir/:idfactura'  => 'api#validar_factura'

  get 'api/pagos/recibir/:idtrx'         => 'api#validar_pago'

  get 'api/despachos/recibir/:idfactura' => 'api#validar_despacho'

  post 'api/facturas/boleta'             => 'invoices#crear_boleta'

  get 'api/documentacion', :to => redirect('/documentation.html')

  ######################################



  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
