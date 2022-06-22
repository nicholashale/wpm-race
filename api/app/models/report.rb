class Report < ApplicationRecord
    belongs_to :user
    belongs_to :race

    # validates :place, allow_blank: true, numericality: {greater_than_or_equal_to: 1}
    validates :time_ms, presence: true
    validates :accuracy_percent, presence: true, numericality: {greater_than_or_equal_to: 0, less_than_or_equal_to: 100}
end
