# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#

puts "🗑 Clearing database"

User.destroy_all

puts "✅ Done cleaning!"

puts "🌱 Seeding database"

joe = User.create(username: "zamboni", password_digest: BCrypt::Password.create("letmein"))
chandy = User.create(username: "chandizzy123", password_digest: BCrypt::Password.create("hunter2"))
nick = User.create(username: "harper", password_digest: BCrypt::Password.create("asdfasdf"))
phil = User.create(username: "rothberry", password_digest: BCrypt::Password.create("beets"))


puts "✅ Done seeding!"