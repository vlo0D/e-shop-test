class OrderDescription < ApplicationRecord
  belongs_to :order
  belongs_to :item

  validates :quantity, presence: true, numericality: { greater_than: 0, only_integer: true }
end
