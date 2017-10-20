defmodule PlanIt.Day do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "day" do
    field :day_number, :integer

	belongs_to :trip, PlanIt.Trip
    belongs_to :card, PlanIt.Card
    timestamps()
  end
end
