class Item < ApplicationRecord
  has_many :order_descriptions, dependent: :restrict_with_error

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
end
