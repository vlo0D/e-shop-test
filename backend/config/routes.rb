Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  devise_for :users,
             path: "api/v1",
             path_names: {
               sign_in: "login",
               sign_out: "logout",
               registration: "signup"
             },
             controllers: {
               sessions: "api/v1/sessions",
               registrations: "api/v1/registrations"
             }

  namespace :api do
    namespace :v1 do
      resources :items
      resources :orders, only: [:index, :show, :create]
      resources :users, only: [:index, :show, :update, :destroy]
      resource :profile, only: [:show, :update]
    end
  end
end
