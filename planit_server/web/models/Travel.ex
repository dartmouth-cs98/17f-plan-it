defmodule PlanIt.Travel do
  use Ecto.Schema

  schema "travel" do
    field :type, :string
		field :duration, :time
		field :start_card_id, has_one(:card, PlanIt.Card)
		field :end_card_id, has_one(:card, PlanIt.Card)

		timestamps()
	end
end
