defmodule PlanIt.Travel do
  use PlanIt.Web, :model

  schema "travel" do
    field :type, :string
		field :duration, :time
		field :start_card_id, references(:card)
		field :end_card_id, references(:card)

		timestamps
	end
end
