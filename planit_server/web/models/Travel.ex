defmodule PlanIt.Travel do
  use Ecto.Schema

  @primary_key {:travel_id, :id, autogenerate: true}
  schema "travel" do
    many_to_many :card, PlanIt.Card

    field :type, :string
		field :duration, :time

		timestamps()
	end
end
