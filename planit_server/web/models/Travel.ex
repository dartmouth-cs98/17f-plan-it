defmodule PlanIt.Travel do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "travel" do
    field :type, :string
	field :duration, :time

	has_many :card_travel, PlanIt.CardTravel
	timestamps()
   end
end
