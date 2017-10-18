defmodule PlanIt.Day do
  use Ecto.Schema

  schema "day" do
    field :day_number, :integer
    field :trip_id, has_one(:trip, PlanIt.Trip)
    field :first_card_id, has_one(:card, PlanIt.Card)
    field :last_card_id, has_one(:card, PlanIt.Card)

    timestamps()
  end
end



