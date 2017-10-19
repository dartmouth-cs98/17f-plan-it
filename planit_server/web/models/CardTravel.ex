defmodule PlanIt.CardTravel do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "card_travel" do
    belongs_to :card, PlanIt.Card
    belongs_to :travel, PlanIt.Travel

    field :card_is_destination, :boolean

		timestamps()
	end
end
