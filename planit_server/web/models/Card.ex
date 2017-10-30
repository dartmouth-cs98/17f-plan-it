defmodule PlanIt.Card do
  use Ecto.Schema

  import Ecto.Changeset
  @primary_key {:id, :id, autogenerate: true}
  schema "card" do
    belongs_to :trip, PlanIt.Trip
    belongs_to :travel, PlanIt.Travel

    field :type, :string
    field :name, :string
    field :city, :string
    field :country, :string
    field :address, :string
    field :lat, :float
    field :long, :float
    field :start_time, :utc_datetime
    field :end_time, :utc_datetime
    field :day_number, :integer

    timestamps()
  end

  def changeset(card, params) do
    #validate format of lat and long
    card
    |> cast(params, [:type, :name, :city, :country, :address, :lat, :long, :start_time, :end_time, :day_number])
    |> cast(params, [:travel_id, :trip_id])
    |> validate_required([:name, :country, :day_number])
  end
end
