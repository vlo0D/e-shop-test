class Api::V1::OrdersController < Api::V1::BaseController
  def index
    @orders = current_user.orders.order(created_at: :desc)
    render json: @orders.as_json(only: [:id, :amount, :created_at])
  end

  def show
    @order = current_user.orders.find(params[:id])
    render json: {
      id: @order.id,
      amount: @order.amount,
      created_at: @order.created_at,
      items: @order.order_descriptions.includes(:item).map do |od|
        {
          id: od.item.id,
          name: od.item.name,
          description: od.item.description,
          price: od.item.price,
          quantity: od.quantity,
          subtotal: (od.item.price * od.quantity).round(2)
        }
      end
    }
  end

  def create
    items_params = params.require(:items)

    ActiveRecord::Base.transaction do
      @order = current_user.orders.build(amount: 0)

      total = 0
      items_params.each do |item_param|
        item = Item.find(item_param[:item_id])
        quantity = item_param[:quantity].to_i
        total += item.price * quantity

        @order.order_descriptions.build(
          item: item,
          quantity: quantity
        )
      end

      @order.amount = total.round(2)
      @order.save!
    end

    render json: {
      id: @order.id,
      amount: @order.amount,
      created_at: @order.created_at,
      message: "Order placed successfully."
    }, status: :created
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: "Item not found: #{e.message}" }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end
end
