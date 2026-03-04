class Api::V1::ItemsController < Api::V1::BaseController
  before_action :authorize_admin!, only: [:create, :update, :destroy]
  before_action :set_item, only: [:show, :update, :destroy]

  def index
    @items = Item.all
    if params[:search].present?
      @items = @items.where("name ILIKE ?", "%#{params[:search]}%")
    end
    @items = @items.order(:name)
    render json: @items
  end

  def show
    render json: @item
  end

  def create
    @item = Item.new(item_params)
    if @item.save
      render json: @item, status: :created
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @item.update(item_params)
      render json: @item
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @item.destroy
      render json: { message: "Item deleted successfully." }
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_item
    @item = Item.find(params[:id])
  end

  def item_params
    params.require(:item).permit(:name, :description, :price)
  end
end
