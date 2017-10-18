defmodule PlanIt.Travel do
  use Ecto.Schema

  schema "travel" do
    field :type, :string
		field :duration, :time
		has_one(:card, PlanIt.Card)

		timestamps()
	end
end
