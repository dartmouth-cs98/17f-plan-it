defmodule PlanIt.Card do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "card" do
    belongs_to :trip, PlanIt.Trip
    belongs_to :travel, PlanIt.Travel

    field :type, :string
    field :name, :string
    field :city, :string
    field :country, :string
    field :address, :string
    field :start_time, :utc_datetime
    field :end_time, :utc_datetime
    field :day_number, :integer

    timestamps()
  end
end
