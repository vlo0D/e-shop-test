class Api::V1::BaseController < ApplicationController
  before_action :authenticate_user!

  private

  def authorize_admin!
    unless current_user&.admin?
      render json: { error: "Access denied. Admin only." }, status: :forbidden
    end
  end
end
