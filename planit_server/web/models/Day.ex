defmodule PlanIt.Day do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "day" do
    belongs_to :trip, PlanIt.Trip
    belongs_to :card, PlanIt.Card

    field :day_number, :integer

    timestamps()
  end
end
