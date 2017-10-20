defmodule PlanIt.Card do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "card" do
    has_one :trip, PlanIt.Trip
    has_one :day, PlanIt.Day
    has_many :card_travel, PlanIt.CardTravel

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
