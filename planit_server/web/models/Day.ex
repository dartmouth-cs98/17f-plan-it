defmodule PlanIt.Day do
  use Ecto.Schema

  schema "day" do
    belongs_to :trip, PlanIt.Trip
    many_to_many :card, PlanIt.Card

    field :day_number, :integer

    timestamps()
  end
end
