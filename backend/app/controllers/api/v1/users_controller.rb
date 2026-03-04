class Api::V1::UsersController < Api::V1::BaseController
  before_action :authorize_admin!
  before_action :set_user, only: [:show, :update, :destroy]

  def index
    @users = User.all.order(:id)
    render json: @users.map { |u|
      { id: u.id, email: u.email, first_name: u.first_name, last_name: u.last_name, role: u.role }
    }
  end

  def show
    render json: {
      id: @user.id,
      email: @user.email,
      first_name: @user.first_name,
      last_name: @user.last_name,
      role: @user.role
    }
  end

  def update
    update_params = user_params
    update_params.delete(:password) if update_params[:password].blank?
    update_params.delete(:password_confirmation) if update_params[:password_confirmation].blank?

    if @user.update(update_params)
      render json: {
        id: @user.id,
        email: @user.email,
        first_name: @user.first_name,
        last_name: @user.last_name,
        role: @user.role
      }
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
    render json: { message: "User deleted successfully." }
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :role, :password, :password_confirmation)
  end
end
