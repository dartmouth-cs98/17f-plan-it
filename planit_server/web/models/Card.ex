defmodule PlanIt.Card do
  use Ecto.Schema

  @primary_key {:card_id, :id, autogenerate: true}
  schema "card" do

    belongs_to :trip, PlanIt.Trip
    many_to_many :day, PlanIt.Day
    many_to_many :travel, PlanIt.Travel

    field :type, :string
    field :name, :string
    field :city, :string
    field :country, :string
    field :address, :string
    field :start_time, :utc_datetime
    field :end_time, :utc_datetime

    timestamps()
  end
end
