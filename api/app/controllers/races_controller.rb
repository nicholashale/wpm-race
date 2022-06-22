class RacesController < ApplicationController

    def create
        race = Race.create(race_params)
        if race.valid?
            render json: race, status: :created
        else
            render json: { errors: race.errors.full_messages }, status: :unprocessable_entity
        end
    end

    private

    def race_params
        params.permit(:text)
    end
end
