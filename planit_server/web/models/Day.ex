defmodule PlanIt.Day do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "day" do
    belongs_to :trip, PlanIt.Trip
    has_many :card, PlanIt.Card

    field :day_number, :integer

    timestamps()
  end
end
