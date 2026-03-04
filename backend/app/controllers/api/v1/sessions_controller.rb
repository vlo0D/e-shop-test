class Api::V1::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: {
      status: { code: 200, message: "Logged in successfully." },
      data: {
        id: resource.id,
        email: resource.email,
        first_name: resource.first_name,
        last_name: resource.last_name,
        role: resource.role
      }
    }, status: :ok
  end

  def respond_to_on_destroy(_resource = nil)
    if request.headers["Authorization"].present?
      render json: {
        status: { code: 200, message: "Logged out successfully." }
      }, status: :ok
    else
      render json: {
        status: { code: 401, message: "Couldn't find an active session." }
      }, status: :unauthorized
    end
  end
end
