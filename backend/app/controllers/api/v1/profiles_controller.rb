class Api::V1::ProfilesController < Api::V1::BaseController
  def show
    render json: {
      id: current_user.id,
      email: current_user.email,
      first_name: current_user.first_name,
      last_name: current_user.last_name,
      role: current_user.role
    }
  end

  def update
    update_params = profile_params
    update_params.delete(:password) if update_params[:password].blank?
    update_params.delete(:password_confirmation) if update_params[:password_confirmation].blank?

    if current_user.update(update_params)
      render json: {
        id: current_user.id,
        email: current_user.email,
        first_name: current_user.first_name,
        last_name: current_user.last_name,
        role: current_user.role
      }
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
  end
end
