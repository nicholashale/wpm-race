class ReportsController < ApplicationController

    def create
        report = Report.create(report_params)
        if report.valid?
            render json: report, status: :created
        else
            render json: { errors: report.errors.full_messages }, status: :unprocessable_entity
        end
    end

    private

    def report_params
        params.permit(:race_id, :user_id, :time_ms, :accuracy_percent, :place)
    end
end
