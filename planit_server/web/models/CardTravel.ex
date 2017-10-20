defmodule PlanIt.CardTravel do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "card_travel" do
    field :card_is_destination, :boolean

    belongs_to :card, PlanIt.Card
    belongs_to :travel, PlanIt.Travel
	timestamps()
  end
end
