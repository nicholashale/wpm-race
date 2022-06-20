class User < ApplicationRecord
    has_many :reports
    has_many :races, through: :reports
    
    has_secure_password
end
