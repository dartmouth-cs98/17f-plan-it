defmodule PlanIt.Day do
  use Ecto.Schema

  schema "day" do
    field :day_number, :integer
    has_one(:trip, PlanIt.Trip)
    has_one(:card, PlanIt.Card)

    timestamps()
  end
end



