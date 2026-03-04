puts "Seeding database..."

admin = User.find_or_create_by!(email: "admin@example.com") do |u|
  u.first_name = "Admin"
  u.last_name = "User"
  u.password = "password123"
  u.password_confirmation = "password123"
  u.role = "admin"
end
puts "Admin created: #{admin.email}"

user = User.find_or_create_by!(email: "user@example.com") do |u|
  u.first_name = "John"
  u.last_name = "Doe"
  u.password = "password123"
  u.password_confirmation = "password123"
  u.role = "user"
end
puts "User created: #{user.email}"

items_data = [
  { name: "Laptop", description: "High-performance laptop with 16GB RAM", price: 999.99 },
  { name: "Wireless Mouse", description: "Ergonomic wireless mouse", price: 29.99 },
  { name: "Mechanical Keyboard", description: "RGB mechanical keyboard with Cherry MX switches", price: 149.99 },
  { name: "Monitor 27\"", description: "4K IPS monitor, 27 inches", price: 449.99 },
  { name: "USB-C Hub", description: "7-in-1 USB-C hub with HDMI", price: 49.99 },
  { name: "Webcam HD", description: "1080p webcam with microphone", price: 79.99 },
  { name: "Headphones", description: "Noise-cancelling wireless headphones", price: 199.99 },
  { name: "SSD 1TB", description: "NVMe SSD, 1TB, read speed 3500MB/s", price: 89.99 },
  { name: "Phone Stand", description: "Adjustable aluminum phone stand", price: 19.99 },
  { name: "Power Bank", description: "20000mAh portable charger", price: 39.99 }
]

items_data.each do |item_data|
  Item.find_or_create_by!(name: item_data[:name]) do |item|
    item.description = item_data[:description]
    item.price = item_data[:price]
  end
end
puts "#{Item.count} items seeded"

puts "Seeding complete!"
