defmodule PlanIt.Day do
  use PlanIt.Web, :model

  schema "day" do
    field :day_number, :integer
    field :trip_id, references(:trip)
    field :first_card_id, references(:card)
    field :last_card_id, references(:card)

    timestamps
  end
end



